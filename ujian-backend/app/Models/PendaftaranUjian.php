<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * PendaftaranUjian — Representasi pendaftaran ujian mahasiswa.
 *
 * Alur: Mahasiswa daftar → Sekprodi verifikasi → Status disetujui →
 * Otomatis buat record Ujian + assign penguji dari pembimbing.
 *
 * @property int         $id
 * @property int         $mahasiswa_id
 * @property int         $ranpel_id
 * @property int         $jenis_ujian_id
 * @property int|null    $perbaikan_judul_id    Perbaikan judul terakhir yang diterima
 * @property string|null $judul_snapshot         Snapshot judul saat pendaftaran
 * @property string      $tanggal_pengajuan
 * @property string|null $tanggal_disetujui
 * @property string      $status                menunggu|belum dijadwalkan|dijadwalkan|selesai
 * @property string|null $keterangan
 */
class PendaftaranUjian extends Model
{
    use HasFactory;

    protected $table = 'pendaftaran_ujian';

    protected $fillable = [
        'mahasiswa_id',
        'ranpel_id',
        'jenis_ujian_id',
        'perbaikan_judul_id',
        'judul_snapshot',
        'tanggal_pengajuan',
        'tanggal_disetujui',
        'status',
        'keterangan',
    ];

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Mahasiswa yang mendaftar ujian. */
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    /** Jenis ujian yang didaftarkan. */
    public function jenisUjian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }

    /** Record ujian yang dihasilkan dari pendaftaran ini. */
    public function ujian()
    {
        return $this->hasOne(Ujian::class, 'pendaftaran_ujian_id');
    }

    /** Daftar pemenuhan syarat untuk pendaftaran ini. */
    public function pemenuhanSyarat()
    {
        return $this->hasMany(PemenuhanSyarat::class, 'pendaftaran_ujian_id');
    }

    /** Rancangan penelitian yang menjadi dasar ujian. */
    public function ranpel()
    {
        return $this->belongsTo(Ranpel::class, 'ranpel_id');
    }

    /** Berkas dokumen pendukung pendaftaran. */
    public function berkas()
    {
        return $this->hasMany(Berkas::class, 'pendaftaran_ujian_id');
    }

    /** Perbaikan judul yang digunakan (jika ada). */
    public function perbaikanJudul()
    {
        return $this->belongsTo(PerbaikanJudul::class, 'perbaikan_judul_id');
    }

    // ========================================================================
    // MODEL EVENTS
    // ========================================================================

    protected static function booted()
    {
        /**
         * Saat creating: auto-fill tanggal_pengajuan, judul_snapshot,
         * dan tanggal_disetujui (jika status = "belum dijadwalkan").
         */
        static::creating(function ($pendaftaran) {
            if (empty($pendaftaran->tanggal_pengajuan)) {
                $pendaftaran->tanggal_pengajuan = now()->toDateTimeString();
            }

            // Ambil judul aktif (dari perbaikan judul terakhir atau judul asal ranpel)
            if (empty($pendaftaran->judul_snapshot)) {
                $ranpel = Ranpel::find($pendaftaran->ranpel_id);

                if ($ranpel) {
                    $pj = PerbaikanJudul::query()
                        ->where('mahasiswa_id', $pendaftaran->mahasiswa_id)
                        ->where('ranpel_id', $ranpel->id)
                        ->where('status', 'diterima')
                        ->orderByDesc('tanggal_diterima')
                        ->orderByDesc('id')
                        ->first();

                    $pendaftaran->perbaikan_judul_id = $pj?->id;
                    $pendaftaran->judul_snapshot = $pj?->judul_baru ?? $ranpel->judul_penelitian;
                }
            }

            if ($pendaftaran->status === 'belum dijadwalkan' && empty($pendaftaran->tanggal_disetujui)) {
                $pendaftaran->tanggal_disetujui = now()->toDateTimeString();
            }
        });

        /**
         * Saat updating ke status "belum dijadwalkan":
         * 1. Set tanggal_disetujui
         * 2. Buat record Ujian (jika belum ada)
         * 3. Auto-assign pembimbing 1 & 2 sebagai ketua/sekretaris penguji
         */
        static::updating(function ($pendaftaran) {
            if (!($pendaftaran->isDirty('status') && $pendaftaran->status === 'belum dijadwalkan')) {
                return;
            }

            DB::transaction(function () use ($pendaftaran) {
                if (empty($pendaftaran->tanggal_disetujui)) {
                    $pendaftaran->tanggal_disetujui = now()->toDateTimeString();
                }

                // Buat record ujian
                $ujian = Ujian::firstOrCreate(
                    ['pendaftaran_ujian_id' => $pendaftaran->id],
                    [
                        'jenis_ujian_id' => $pendaftaran->jenis_ujian_id,
                        'mahasiswa_id'   => $pendaftaran->mahasiswa_id,
                    ]
                );

                // Auto-assign pembimbing sebagai penguji
                $mahasiswa = $pendaftaran->mahasiswa()
                    ->with(['pembimbing1', 'pembimbing2'])
                    ->first();

                if ($mahasiswa?->pembimbing1) {
                    PengujiUjian::updateOrCreate(
                        ['ujian_id' => $ujian->id, 'peran' => 'ketua_penguji'],
                        ['dosen_id' => $mahasiswa->pembimbing1->id]
                    );
                }

                if ($mahasiswa?->pembimbing2) {
                    PengujiUjian::updateOrCreate(
                        ['ujian_id' => $ujian->id, 'peran' => 'sekretaris_penguji'],
                        ['dosen_id' => $mahasiswa->pembimbing2->id]
                    );
                }
            });
        });
    }
}
