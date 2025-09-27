<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendaftaranUjian extends Model
{
    /** @use HasFactory<\Database\Factories\PendaftaranUjianFactory> */
    use HasFactory;

    protected $table = "pendaftaran_ujian";
    protected $fillable = [
        'mahasiswa_id',
        'jenis_ujian_id',
        'skripsi_id',
        'status',
        'created_by',
        'verified_by',
        'verified_at',
        'keterangan'
    ];

    
}
