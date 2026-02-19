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
        'nip',
        'email',
        'no_hp',
        'alamat',
        'tempat_tanggal_lahir',
        'pangkat',
        'golongan',
        'tmt_fst',
        'jabatan',
        'prodi_id',
        'foto',
        'user_id',
        'url_ttd'
    ];

    protected $casts = [
        'tmt_fst' => 'datetime',
    ];

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }

    // public function bimbinganSebagaiPembimbing1()
    // {
    //     return $this->hasMany(Skripsi::class, 'pembimbing_1');
    // }

    // public function bimbinganSebagaiPembimbing2()
    // {
    //     return $this->hasMany(Skripsi::class, 'pembimbing_2');
    // }

    public function penilaian()
    {
        return $this->hasMany(Penilaian::class, 'dosen_id');
    }

    public function bimbingan()
    {
        return $this->hasMany(Bimbingan::class, 'dosen_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function mahasiswaBimbingan1()
    {
        return $this->hasMany(Mahasiswa::class, 'pembimbing_1');
    }

    public function mahasiswaBimbingan2()
    {
        return $this->hasMany(Mahasiswa::class, 'pembimbing_2');
    }

    public function mahasiswaPa()
    {
        return $this->hasMany(Mahasiswa::class, 'dosen_pa');
    }

    //ujian dosen
    public function ujian()
    {
        return $this->belongsToMany(Ujian::class, 'penguji_ujian', 'dosen_id', 'ujian_id')
            ->withPivot('peran')
            ->withTimestamps();
    }

    public function pengujiUjian()
    {
        return $this->hasMany(PengujiUjian::class, 'dosen_id');
    }

    public function daftarKehadiran()
    {
        return $this->hasMany(DaftarKehadiran::class, 'dosen_id');
    }



}
