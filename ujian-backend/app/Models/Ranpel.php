<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Ranpel — Rancangan Penelitian.
 *
 * Berisi data proposal penelitian mahasiswa sebelum diajukan.
 * Judul aktif bisa berubah melalui mekanisme perbaikan judul.
 *
 * @property int         $id
 * @property string      $judul_penelitian
 * @property string|null $masalah_dan_penyebab
 * @property string|null $alternatif_solusi
 * @property string|null $metode_penelitian
 * @property string|null $hasil_yang_diharapkan
 * @property string|null $kebutuhan_data
 * @property string|null $jurnal_referensi
 */
class Ranpel extends Model
{
    use HasFactory;

    protected $table = 'ranpel';

    protected $fillable = [
        'judul_penelitian', 'masalah_dan_penyebab', 'alternatif_solusi',
        'metode_penelitian', 'hasil_yang_diharapkan', 'kebutuhan_data',
        'jurnal_referensi',
    ];

    protected $casts = [
        'judul_penelitian' => 'string',
        'created_at'       => 'datetime',
        'updated_at'       => 'datetime',
    ];

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Pengajuan ranpel terkait. */
    public function pengajuanRanpel()
    {
        return $this->hasOne(PengajuanRanpel::class, 'ranpel_id');
    }

    /** Daftar pendaftaran ujian yang menggunakan ranpel ini. */
    public function pendaftaranUjian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'ranpel_id');
    }

    /** Daftar perbaikan judul untuk ranpel ini. */
    public function perbaikanJudul()
    {
        return $this->hasMany(PerbaikanJudul::class, 'ranpel_id');
    }

    /** Perbaikan judul terakhir yang diterima. */
    public function perbaikanJudulTerakhirDiterima()
    {
        return $this->hasOne(PerbaikanJudul::class, 'ranpel_id')
            ->where('status', 'diterima')
            ->orderByDesc('tanggal_diterima')
            ->orderByDesc('id');
    }

    // ========================================================================
    // ACCESSOR
    // ========================================================================

    /**
     * Judul aktif: dari perbaikan judul terakhir yang diterima,
     * atau judul asal jika belum ada perbaikan.
     */
    public function getJudulAktifAttribute()
    {
        return $this->perbaikanJudulTerakhirDiterima?->judul_baru ?? $this->judul_penelitian;
    }
}
