<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Berkas — Dokumen pendukung pendaftaran ujian.
 *
 * @property int    $id
 * @property int    $pendaftaran_ujian_id
 * @property string $nama_berkas
 * @property string $file_path
 */
class Berkas extends Model
{
    use HasFactory;

    protected $table = 'berkas';

    protected $fillable = [
        'pendaftaran_ujian_id', 'nama_berkas', 'file_path',
    ];

    /** Pendaftaran ujian pemilik berkas ini. */
    public function pendaftaranUjian()
    {
        return $this->belongsTo(PendaftaranUjian::class, 'pendaftaran_ujian_id');
    }
}
