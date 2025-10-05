<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bimbingan extends Model
{
    /** @use HasFactory<\Database\Factories\BimbinganFactory> */
    use HasFactory;

    protected $table = 'bimbingan';

    protected $fillable = [
        'skripsi_id',
        'dosen_id',
        'mahasiswa_id',
        'keterangan',
        'file_path',
        'status',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function skripsi()
    {
        return $this->belongsTo(Skripsi::class);
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class);
    }
}
