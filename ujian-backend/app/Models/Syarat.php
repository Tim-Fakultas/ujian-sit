<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Syarat extends Model
{
    /** @use HasFactory<\Database\Factories\SyaratFactory> */
    use HasFactory;

    protected $table = "syarat";
    protected $fillable = [
        'jenis_ujian_id',
        'nama_syarat',
        'kategori',
        'wajib',
    ];

    public function jenisUjian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }

    public function pemenuhanSyarat()
    {
        return $this->hasMany(PemenuhanSyarat::class, 'syarat_id');
    }
}
