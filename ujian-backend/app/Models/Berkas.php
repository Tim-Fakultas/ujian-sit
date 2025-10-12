<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Berkas extends Model
{
    /** @use HasFactory<\Database\Factories\BerkasFactory> */
    use HasFactory;

    protected $table = 'berkas';

    protected $fillable = [
        'pendaftaran_ujian_id',
        'nama_berkas',
        'file_path',
    ];

    public function pendaftaran_ujian()
    {
        return $this->belongsTo(PendaftaranUjian::class, 'pendaftaran_ujian_id');
    }
}


