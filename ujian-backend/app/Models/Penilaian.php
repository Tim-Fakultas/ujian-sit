<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Penilaian — Nilai yang diberikan dosen penguji pada komponen ujian.
 *
 * Setiap record = 1 dosen × 1 komponen × 1 ujian.
 * Saat penilaian disimpan/dihapus, nilai akhir ujian otomatis dihitung ulang.
 *
 * @property int         $id
 * @property int         $ujian_id
 * @property int         $dosen_id
 * @property int         $komponen_penilaian_id
 * @property float       $nilai
 * @property string|null $komentar
 */
class Penilaian extends Model
{
    use HasFactory;

    protected $table = 'penilaian';

    protected $fillable = [
        'ujian_id', 'dosen_id', 'komponen_penilaian_id', 'nilai', 'komentar',
    ];

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Ujian yang dinilai. */
    public function ujian()
    {
        return $this->belongsTo(Ujian::class, 'ujian_id');
    }

    /** Dosen penguji yang memberikan nilai. */
    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }

    /** Komponen penilaian (misal: Isi Materi, Presentasi, dll). */
    public function komponenPenilaian()
    {
        return $this->belongsTo(KomponenPenilaian::class, 'komponen_penilaian_id');
    }

    // ========================================================================
    // MODEL EVENTS
    // ========================================================================

    protected static function booted()
    {
        // Hitung ulang nilai akhir ujian setiap kali penilaian berubah
        static::saved(function ($penilaian) {
            $penilaian->ujian?->hitungNilaiAkhir();
        });

        static::deleted(function ($penilaian) {
            $penilaian->ujian?->hitungNilaiAkhir();
        });
    }
}
