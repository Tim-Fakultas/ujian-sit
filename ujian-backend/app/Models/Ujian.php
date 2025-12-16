<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    /** @use HasFactory<\Database\Factories\UjianFactory> */
    use HasFactory;

    protected $table = 'ujian';

    protected $fillable = [
        'pendaftaran_ujian_id',
        'mahasiswa_id',
        'jenis_ujian_id',
        'hari_ujian',
        'jadwal_ujian',
        'waktu_mulai',
        'waktu_selesai',
        'ruangan_id',
        'keputusan_id',
        'hasil',
        'nilai_akhir',
        'catatan',
    ];



    public function pendaftaranUjian()
    {
        return $this->belongsTo(PendaftaranUjian::class, 'pendaftaran_ujian_id');
    }

    public function penguji()
    {
        return $this->belongsToMany(Dosen::class, 'penguji_ujian', 'ujian_id', 'dosen_id')
                    ->withPivot('peran')
                    ->withTimestamps();
    }

    public function pengujiUjian()
    {
        return $this->hasMany(PengujiUjian::class, 'dosen_id');
    }

    public function ranpel()
    {
        return $this->belongsToThrough(
            Ranpel::class,
            PendaftaranUjian::class,
            'pendaftaran_ujian_id', // FK di tabel ujian
            'id',                   // PK di tabel ranpel
            'id',                   // PK di tabel ujian
            'ranpel_id'             // FK di tabel pendaftaran_ujian
        );
    }

    public function jenisUjian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function penilaian()
    {
        return $this->hasMany(Penilaian::class, 'ujian_id');
    }

    public function ketua()
    {
        return $this->belongsTo(Dosen::class, 'ketua_penguji');
    }

    public function sekretaris()
    {
        return $this->belongsTo(Dosen::class, 'sekretaris_penguji');
    }

    public function pengujiSatu()
    {
        return $this->belongsTo(Dosen::class, 'penguji_1');
    }

    public function pengujiDua()
    {
        return $this->belongsTo(Dosen::class, 'penguji_2');
    }

    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class, 'ruangan_id');
    }

    public function daftarKehadiran()
    {
        return $this->hasMany(DaftarKehadiran::class, 'ujian_id');
    }

    public function keputusan()
    {
        return $this->belongsTo(Keputusan::class, 'keputusan_id');
    }

   public function hitungNilaiAkhir(): ?self
{
    $subQuery = $this->penilaian()
        ->getQuery()
        ->join('komponen_penilaian', 'penilaian.komponen_penilaian_id', '=', 'komponen_penilaian.id')
        ->selectRaw('
            penilaian.dosen_id,
            (SUM(penilaian.nilai * komponen_penilaian.bobot) * 1.0)
            / NULLIF(SUM(komponen_penilaian.bobot), 0) AS total
        ')
        ->groupBy('penilaian.dosen_id');

    $rataRata = DB::query()
        ->fromSub($subQuery, 't')
        ->avg('t.total');

    if ($rataRata === null) {
        return null; // tidak ada data
    }

    $nilaiAkhir = round((float) $rataRata, 2);

    $this->update([
        'nilai_akhir' => $nilaiAkhir,
        'hasil'       => $nilaiAkhir >= 70 ? 'lulus' : 'tidak lulus',
    ]);

    return $this;
}

    protected static function booted()
    {
        static::updating(function ($ujian) {
            // Jika nilai_akhir diubah, otomatis set hasil
            if($ujian->isDirty('jadwal_ujian') && !empty($ujian->jadwal_ujian)){
                $ujian->pendaftaranUjian()->update(['status' => 'dijadwalkan']);
            }
        });
    }
}
