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
        'jenis_ujian_id',
        'mahasiswa_id',
        'jadwal_ujian',
        'waktu_mulai',
        'waktu_selesai',
        'ruangan',
        'status',
        'hasil',
        'nilai',
        'created_by',
        'updated_by',
        'catatan',
    ];



    public function pendaftaran_ujian()
    {
        return $this->belongsTo(PendaftaranUjian::class, 'pendaftaran_ujian_id');
    }

    public function skripsi()
    {
        return $this->hasOneThrough(Skripsi::class, PendaftaranUjian::class, 'id', 'id', 'pendaftaran_ujian_id', 'skripsi_id');
    }

    public function jenis_ujian()
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
}
}
