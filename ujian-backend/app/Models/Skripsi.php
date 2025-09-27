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
        'pengajuan_judul_id',
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
        return $this->hasOneThrough(Mahasiswa::class, PengajuanJudul::class, 'id', 'id', 'pengajuan_judul_id', 'mahasiswa_id');
    }
    public function pengajuan_judul()
    {
        return $this->belongsTo(PengajuanJudul::class, 'pengajuan_judul_id');
    }
    public function bimbingan(){
        return $this->hasMany(Bimbingan::class, 'skripsi_id');
    }
}
