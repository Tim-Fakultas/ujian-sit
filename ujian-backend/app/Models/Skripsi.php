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
        'mahasiswa_id',
        'judul_skripsi',
        'identifikasi_masalah',
        'rumusan_masalah',
        'tujuan_penelitian',
        'manfaat_penelitian',
        'metode_penelitian',
        'penelitian_sebelumnya',
        'pokok_masalah',
        'deskripsi_lengkap',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
    ];


    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }
    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class, 'id_pengajuan');
    }
    public function bimbingan(){
        return $this->hasMany(Bimbingan::class, 'skripsi_id');
    }
}
