<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengujiUjian extends Model
{
    use HasFactory;

    protected $fillable = [
        'ujian_id',
        'dosen_id',
        'peran',
    ];

    protected $table = 'penguji_ujian';

    public function ujian()
    {
        return $this->belongsTo(Ujian::class, 'ujian_id');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }
}
