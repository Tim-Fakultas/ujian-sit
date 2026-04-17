<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * PengajuanRanpel — Pengajuan rancangan penelitian oleh mahasiswa.
 *
 * Alur status: menunggu → diverifikasi → diterima/ditolak.
 * Tanggal transisi status diisi otomatis via model event.
 *
 * @property int         $id
 * @property int         $ranpel_id
 * @property int         $mahasiswa_id
 * @property string      $tanggal_pengajuan
 * @property string|null $tanggal_diterima
 * @property string|null $tanggal_diverifikasi
 * @property string|null $tanggal_ditolak
 * @property string      $status             menunggu|diverifikasi|diterima|ditolak
 * @property string|null $keterangan
 * @property string|null $catatan_kaprodi
 */
class PengajuanRanpel extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_ranpel';

    protected $fillable = [
        'ranpel_id', 'mahasiswa_id', 'tanggal_pengajuan', 'tanggal_diterima',
        'tanggal_diverifikasi', 'tanggal_ditolak', 'status', 'keterangan',
        'catatan_kaprodi',
    ];

    // ========================================================================
    // MODEL EVENTS
    // ========================================================================

    protected static function booted()
    {
        // Auto-fill tanggal_pengajuan saat membuat record baru
        static::creating(function ($pengajuan) {
            if (empty($pengajuan->tanggal_pengajuan)) {
                $pengajuan->tanggal_pengajuan = now();
            }
        });

        // Auto-fill tanggal transisi saat status berubah
        static::updating(function ($pengajuan) {
            if ($pengajuan->isDirty('status')) {
                match ($pengajuan->status) {
                    'diterima'     => $pengajuan->tanggal_diterima = now(),
                    'diverifikasi' => $pengajuan->tanggal_diverifikasi = now(),
                    'ditolak'      => $pengajuan->tanggal_ditolak = now(),
                    default        => null,
                };
            }
        });
    }

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Rancangan penelitian yang diajukan. */
    public function ranpel()
    {
        return $this->belongsTo(Ranpel::class, 'ranpel_id');
    }

    /** Mahasiswa yang mengajukan. */
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }
}
