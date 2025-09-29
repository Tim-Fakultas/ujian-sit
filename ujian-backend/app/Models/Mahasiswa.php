<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Prodi;
use App\Models\PengajuanJudul;

class Mahasiswa extends Model
{
    /** @use HasFactory<\Database\Factories\MahasiswaFactory> */
    use HasFactory;

    protected $table = "mahasiswa";
    protected $primaryKey = "id";
    protected $fillable = [
        'nim',
        'nama',
        'no_hp',
        'alamat',
        'prodi_id',
    ];

    public function pengajuan_judul(){
        return $this->hasMany(PengajuanJudul::class, 'mahasiswa_id', 'id');
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function ujian()
    {
        return $this->hasMany(Ujian::class, 'mahasiswa_id');
    }

    public function pendaftaran_ujian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'mahasiswa_id');
    }

    public function skripsi(){
        return $this->hasMany(Skripsi::class, 'mahasiswa_id');
    }

    public function bimbingan(){
        return $this->hasMany(Bimbingan::class, 'mahasiswa_id');
    }
}
