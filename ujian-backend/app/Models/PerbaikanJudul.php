<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * PerbaikanJudul — Pengajuan perubahan judul penelitian.
 *
 * Mahasiswa dapat mengubah judul melalui persetujuan dosen PA/pembimbing.
 * Jika diterima, judul baru otomatis disinkronkan ke tabel ranpel.
 *
 * @property int         $id
 * @property int         $ranpel_id
 * @property int         $mahasiswa_id
 * @property string      $judul_lama
 * @property string      $judul_baru
 * @property string|null $berkas               Path file pendukung
 * @property string      $status               menunggu|diterima|ditolak
 * @property string      $tanggal_perbaikan
 * @property string|null $tanggal_diterima
 */
class PerbaikanJudul extends Model
{
    use HasFactory;

    protected $table = 'perbaikan_judul';

    protected $fillable = [
        'ranpel_id', 'mahasiswa_id', 'judul_lama', 'judul_baru',
        'berkas', 'status', 'tanggal_perbaikan', 'tanggal_diterima',
    ];

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Ranpel yang judulnya diperbaiki. */
    public function ranpel()
    {
        return $this->belongsTo(Ranpel::class, 'ranpel_id');
    }

    /** Mahasiswa yang mengajukan perbaikan. */
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }
}
