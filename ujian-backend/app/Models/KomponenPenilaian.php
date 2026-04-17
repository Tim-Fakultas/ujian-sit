<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * KomponenPenilaian — Komponen yang dinilai dalam ujian.
 *
 * Setiap jenis ujian memiliki komponen dengan bobot tertentu.
 * Contoh: Isi Materi (30%), Presentasi (20%), Media (10%), dll.
 *
 * @property int         $id
 * @property int         $jenis_ujian_id
 * @property string      $nama_komponen
 * @property string|null $deskripsi
 * @property float       $bobot   Persentase bobot komponen (misal: 30)
 */
class KomponenPenilaian extends Model
{
    use HasFactory;

    protected $table = 'komponen_penilaian';

    protected $fillable = [
        'jenis_ujian_id', 'nama_komponen', 'deskripsi', 'bobot',
    ];

    /** Jenis ujian yang memiliki komponen ini. */
    public function jenisUjian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }
}
