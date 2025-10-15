<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class Mahasiswa extends Model
{
    /** @use HasFactory<\Database\Factories\MahasiswaFactory> */
    use HasFactory, HasRoles;

    protected $table = 'mahasiswa';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nim',
        'nama',
        'no_hp',
        'alamat',
        'prodi_id',
        'peminatan_id',
        'semester',
        'ipk',
        'dosen_pa',
        'pembimbing_1',
        'pembimbing_2',
        'status',
        'angkatan',
        'user_id'
    ];

    protected $casts = [
        'ipk' => 'float',
        'semester' => 'integer',
        'status' => 'string',
        'angkatan' => 'string'
    ];



    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function peminatan()
    {
        return $this->belongsTo(Peminatan::class, 'peminatan_id');
    }

    public function dosenPembimbingAkademik()
    {
        return $this->belongsTo(Dosen::class, 'dosen_pa');
    }

    public function ujian()
    {
        return $this->hasMany(Ujian::class, 'mahasiswa_id');
    }

    public function pendaftaranUjian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'mahasiswa_id');
    }

    public function skripsi()
    {
        return $this->hasMany(Skripsi::class, 'mahasiswa_id');
    }

    public function bimbingan()
    {
        return $this->hasMany(Bimbingan::class, 'mahasiswa_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function pengajuanRanpel()
    {
        return $this->hasMany(PengajuanRanpel::class, 'mahasiswa_id');
    }

    public function pembimbing1()
    {
        return $this->belongsTo(Dosen::class, 'pembimbing_1');
    }

    public function pembimbing2()
    {
        return $this->belongsTo(Dosen::class, 'pembimbing_2');
    }

}
