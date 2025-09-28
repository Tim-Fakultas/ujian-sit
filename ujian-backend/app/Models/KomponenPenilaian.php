<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KomponenPenilaian extends Model
{
    /** @use HasFactory<\Database\Factories\KomponenPenilaianFactory> */
    use HasFactory;

    protected $table = "komponen_penilaian";
    protected $fillable = [
        'jenis_ujian_id',
        'nama_komponen',
        'bobot',
    ];

    public function jenisUjian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }


    
}
