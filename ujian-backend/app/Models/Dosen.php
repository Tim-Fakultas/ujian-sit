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
        'no_hp',
        'alamat',
        'tempat_tanggal_lahir',
        'pangkat',
        'golongan',
        'tmt_fst',
        'jabatan',
        'prodi_id',
        'foto',
        'user_id'
    ];

    protected $casts = [
        'tmt_fst' => 'datetime',
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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
