<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminatan extends Model
{
    /** @use HasFactory<\Database\Factories\PeminatanFactory> */
    use HasFactory;

    protected $table = 'peminatan';

    protected $fillable = [
        'nama_peminatan',
        'prodi_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relasi ke Prodi
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }

    // Relasi ke Mahasiswa (jika ada)
    public function mahasiswa()
    {
        return $this->hasMany(Mahasiswa::class, 'peminatan_id');
    }
}
