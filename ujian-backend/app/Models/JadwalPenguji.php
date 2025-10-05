<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalPenguji extends Model
{
    /** @use HasFactory<\Database\Factories\JadwalPengujiFactory> */
    use HasFactory;

    protected $fillable = [
        'ujian_id',
        'dosen_id',
        'peran',
    ];

    protected $table = 'jadwal_penguji';

    public function ujian()
    {
        return $this->belongsTo(Ujian::class, 'ujian_id');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }
}
