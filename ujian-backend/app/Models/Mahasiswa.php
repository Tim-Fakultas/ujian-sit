<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    /** @use HasFactory<\Database\Factories\MahasiswaFactory> */
    use HasFactory;

    protected $table = "mahasiswa";
    protected $primaryKey = "id";
    protected $fillable = [
        'nim',
        'nama',
        'no_hp',
        'alamat',
        'prodi_id',
    ];

    public function pengajuan(){
        return $this->hasMany(Pengajuan::class, );
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

}
