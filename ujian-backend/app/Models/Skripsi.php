<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skripsi extends Model
{
    /** @use HasFactory<\Database\Factories\SkripsiFactory> */
    use HasFactory;

    protected $table = "skripsi";

    protected $fillable = [
        'pengajuan_id',
        'judul_skripsi',
        'identifikasi_masalah',
        'rumusan_masalah',
        'penelitian_sebelumnya',
        'pokok_masalah',
        'deskripsi_lengkap',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
    ];


    public function mahasiswa()
    {
        return $this->hasOneThrough(Mahasiswa::class, Pengajuan::class, 'id', 'id', 'pengajuan_id', 'mahasiswa_id');
    }
    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class, 'pengajuan_id');
    }
    public function bimbingan(){
        return $this->hasMany(Bimbingan::class, 'skripsi_id');
    }
}
