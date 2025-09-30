<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ranpel extends Model
{
    /** @use HasFactory<\Database\Factories\RanpelFactory> */
    use HasFactory;

    protected $table = "ranpel";
    protected $fillable = [
        'pengajuan_judul_id',
        'judul',
        'identifikasi_masalah',
        'rumusan_masalah',
        'penelitian_sebelumnya',
        'pokok_masalah',
        'deskripsi_lengkap',
        'status',
    ];

    public function pengajuan_judul(){
        return $this->belongsTo(PengajuanJudul::class, 'pengajuan_judul_id');
    }

    public function skripsi(){
        return $this->hasOne(Skripsi::class, 'ranpel_id');
    }

    public function judul(){
        return $this->belongsTo(Judul::class, 'judul_id');

}
}
