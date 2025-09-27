<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemenuhanSyarat extends Model
{
    /** @use HasFactory<\Database\Factories\PemenuhanSyaratFactory> */
    use HasFactory;
    
    protected $table = "pemenuhan_syarat";
    protected $fillable = [
        'pendaftaran_ujian_id',
        'syarat_id',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'keterangan',
        'status',
        'verified_by',
        'verified_at',
    ];


}
