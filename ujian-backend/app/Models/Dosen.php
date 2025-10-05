<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dosen extends Model
{
    /** @use HasFactory<\Database\Factories\DosenFactory> */
    use HasFactory;

    protected $table = 'dosen';

    protected $fillable = [
        'nama',
        'nidn',
        'no_hp',
        'alamat',
        'prodi_id',
    ];

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }

    public function bimbinganSebagaiPembimbing1()
    {
        return $this->hasMany(Skripsi::class, 'pembimbing_1');
    }

    public function bimbinganSebagaiPembimbing2()
    {
        return $this->hasMany(Skripsi::class, 'pembimbing_2');
    }

    public function pengajuan_judul()
    {
        return $this->hasMany(PengajuanJudul::class, 'pengajuan_id');
    }

    public function jadwal_penguji()
    {
        return $this->hasMany(JadwalPenguji::class, 'dosen_id');
    }

    public function penilaian()
    {
        return $this->hasMany(Penilaian::class, 'dosen_id');
    }

    public function bimbingan()
    {
        return $this->hasMany(Bimbingan::class, 'dosen_id');
    }
}
