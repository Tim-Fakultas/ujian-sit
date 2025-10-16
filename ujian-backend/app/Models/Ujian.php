<?php

namespace App\Models;

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
        'ruangan',
        'ketua_penguji',
        'sekretaris_penguji',
        'penguji_1',
        'penguji_2',
        'hasil',
        'nilai_akhir',
        'catatan',
    ];



    public function pendaftaranUjian()
    {
        return $this->belongsTo(PendaftaranUjian::class, 'pendaftaran_ujian_id');
    }

    public function ketuaPenguji()
    {
        return $this->belongsTo(Dosen::class, 'ketua_penguji');
    }

    public function sekretarisPenguji()
    {
        return $this->belongsTo(Dosen::class, 'sekretaris_penguji');
    }

    public function penguji1()
    {
        return $this->belongsTo(Dosen::class, 'penguji_1');
    }

    public function penguji2()
    {
        return $this->belongsTo(Dosen::class, 'penguji_2');
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

    public function hitungNilaiAkhir()
{
    $nilaiPerDosen = $this->penilaian()
        ->join('komponen_penilaian', 'penilaian.komponen_penilaian_id', '=', 'komponen_penilaian.id')
        ->selectRaw('penilaian.dosen_id, SUM(penilaian.nilai * komponen_penilaian.bobot) / SUM(komponen_penilaian.bobot) as total')
        ->groupBy('penilaian.dosen_id')
        ->pluck('total');

    if ($nilaiPerDosen->isEmpty()) {
        return;
    }

    // Rata-rata antar semua penguji (ketua, sekretaris, penguji 1, penguji 2)
    $rataRata = $nilaiPerDosen->avg();

    $this->update([
        'nilai_akhir' => round($rataRata, 2),
        'hasil' => $rataRata >= 70 ? 'lulus' : 'tidak lulus',
    ]);
    return $this;
}
}
