<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisUjian extends Model
{
    /** @use HasFactory<\Database\Factories\JenisUjianFactory> */
    use HasFactory;

    protected $table = "jenis_ujian";

    protected $fillable = [
        'nama_jenis',
        'deskripsi',
        'aktif'
    ];

    public function pendaftaranUjian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'jenis_ujian_id');
    }

    public function syarat()
    {
        return $this->hasMany(Syarat::class, 'jenis_ujian_id');
    }

    public function komponen()
    {
        return $this->hasMany(KomponenPenilaian::class, 'jenis_ujian_id');
    }

    public function template()
    {
        return $this->hasMany(Template::class, 'jenis_ujian_id');
    }


}
