<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DaftarKehadiran extends Model
{
    /** @use HasFactory<\Database\Factories\DaftarKehadiranFactory> */
    use HasFactory;

    protected $table = 'daftar_kehadiran';
    protected $fillable = [
        'ujian_id',
        'dosen_id',
        'peran',
        'status_kehadiran',
        'keterangan',
    ];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class, 'ujian_id');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }
}
