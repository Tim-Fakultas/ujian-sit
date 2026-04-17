<?php

namespace App\Services;

use App\Models\PengajuanRanpel;
use App\Models\Ujian;

/**
 * KaprodiService — Service layer untuk operasi Ketua Program Studi.
 *
 * Mengenkapsulasi business logic yang terkait dengan:
 * - Pengajuan ranpel (approve/reject/catatan)
 * - Jadwal ujian per prodi
 * - Statistik dashboard Kaprodi
 */
class KaprodiService
{
    /**
     * Ambil daftar pengajuan ranpel berdasarkan prodi.
     *
     * Diurutkan: status "menunggu" di atas, lalu berdasarkan tanggal terbaru.
     *
     * @param  int  $prodiId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPengajuanByProdi(int $prodiId)
    {
        return PengajuanRanpel::with([
            'ranpel',
            'mahasiswa.prodi',
            'mahasiswa.user',
            'mahasiswa.dosenPembimbingAkademik',
            'mahasiswa.pembimbing1',
            'mahasiswa.pembimbing2',
        ])
            ->whereHas('mahasiswa', fn($q) => $q->where('prodi_id', $prodiId))
            ->orderByRaw("FIELD(status, 'menunggu', 'disetujui', 'ditolak')")
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Ambil jadwal ujian berdasarkan prodi.
     *
     * @param  int  $prodiId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getJadwalUjianByProdi(int $prodiId)
    {
        return Ujian::with([
            'mahasiswa.user',
            'mahasiswa.prodi',
            'dosenPenguji',
            'ruangan',
            'jenisUjian',
        ])
            ->whereHas('mahasiswa', fn($q) => $q->where('prodi_id', $prodiId))
            ->orderBy('waktu_mulai', 'desc')
            ->get();
    }

    /**
     * Ambil statistik dashboard Kaprodi.
     *
     * @param  int  $prodiId
     * @return array{pengajuan_menunggu: int, ujian_akan_datang: int}
     */
    public function getDashboardStats(int $prodiId): array
    {
        $pengajuanCount = PengajuanRanpel::whereHas(
            'mahasiswa',
            fn($q) => $q->where('prodi_id', $prodiId)
        )->where('status', 'menunggu')->count();

        $ujianUpcomingCount = Ujian::whereHas(
            'mahasiswa',
            fn($q) => $q->where('prodi_id', $prodiId)
        )->where('waktu_mulai', '>', now())->count();

        return [
            'pengajuan_menunggu' => $pengajuanCount,
            'ujian_akan_datang'  => $ujianUpcomingCount,
        ];
    }

    /**
     * Setujui pengajuan ranpel.
     *
     * @param  int          $id       ID Pengajuan Ranpel
     * @param  string|null  $catatan  Catatan dari Kaprodi
     * @return bool  false jika pengajuan tidak ditemukan
     */
    public function approvePengajuan(int $id, ?string $catatan = null): bool
    {
        $pengajuan = PengajuanRanpel::find($id);
        if (!$pengajuan) return false;

        $pengajuan->update([
            'status'          => 'diterima',
            'catatan_kaprodi' => $catatan,
            'tanggal_diterima' => now(),
        ]);

        return true;
    }

    /**
     * Tolak pengajuan ranpel.
     *
     * @param  int          $id       ID Pengajuan Ranpel
     * @param  string|null  $catatan  Alasan penolakan
     * @return bool  false jika pengajuan tidak ditemukan
     */
    public function rejectPengajuan(int $id, ?string $catatan = null): bool
    {
        $pengajuan = PengajuanRanpel::find($id);
        if (!$pengajuan) return false;

        $pengajuan->update([
            'status'          => 'ditolak',
            'catatan_kaprodi' => $catatan,
            'tanggal_ditolak' => now(),
        ]);

        return true;
    }

    /**
     * Update catatan Kaprodi pada pengajuan ranpel.
     *
     * @param  int          $id       ID Pengajuan Ranpel
     * @param  string|null  $catatan  Catatan baru
     * @return bool  false jika pengajuan tidak ditemukan
     */
    public function updateCatatan(int $id, ?string $catatan = null): bool
    {
        $pengajuan = PengajuanRanpel::find($id);
        if (!$pengajuan) return false;

        $pengajuan->update(['catatan_kaprodi' => $catatan]);

        return true;
    }
}
