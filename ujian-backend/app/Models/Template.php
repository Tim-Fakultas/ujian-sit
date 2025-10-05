<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    /** @use HasFactory<\Database\Factories\TemplateFactory> */
    use HasFactory;

    protected $table = 'template';

    protected $fillable = [
        'nama_template',
        'deskripsi',
        'file_path',
    ];

    public function jenis_ujian()
    {
        return $this->belongsTo(JenisUjian::class);
    }
}
