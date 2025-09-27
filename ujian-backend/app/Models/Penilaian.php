<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penilaian extends Model
{
    /** @use HasFactory<\Database\Factories\PenilaianFactory> */
    use HasFactory;
    protected $table = "penilaian";
    protected $fillable = [
        'ujian_id',
        'dosen_id',
        'komponen_penilaian_id',
        'nilai',
        'komentar',
    ];
}
