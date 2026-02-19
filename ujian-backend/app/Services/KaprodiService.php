<?php

namespace App\Services;

use App\Models\PengajuanRanpel;
use App\Models\Ujian;
use Illuminate\Support\Facades\DB;

class KaprodiService
{
    /**
     * Get Pengajuan Ranpel by Prodi ID
     *
     * @param int $prodiId
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
        ->whereHas('mahasiswa', function ($query) use ($prodiId) {
            $query->where('prodi_id', $prodiId);
        })
        ->orderByRaw("FIELD(status, 'menunggu', 'disetujui', 'ditolak')")
        ->orderBy('created_at', 'desc')
        ->get();
    }

    /**
     * Get Jadwal Ujian by Prodi ID
     *
     * @param int $prodiId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getJadwalUjianByProdi(int $prodiId)
    {
        return Ujian::with([
            'mahasiswa.user',
            'mahasiswa.prodi',
            'dosenPenguji',
            'dosenPembimbing1',
            'dosenPembimbing2',
            'ruangan',
            'jenisUjian'
        ])
        ->whereHas('mahasiswa', function ($query) use ($prodiId) {
            $query->where('prodi_id', $prodiId);
        })
        ->orderBy('waktu_mulai', 'desc')
        ->get();
    }

    /**
     * Get Dashboard Stats for Kaprodi
     *
     * @param int $prodiId
     * @return array
     */
    public function getDashboardStats(int $prodiId)
    {
        $pengajuanCount = PengajuanRanpel::whereHas('mahasiswa', function ($query) use ($prodiId) {
            $query->where('prodi_id', $prodiId);
        })->where('status', 'menunggu')->count();

        $ujianUpcomingCount = Ujian::whereHas('mahasiswa', function ($query) use ($prodiId) {
            $query->where('prodi_id', $prodiId);
        })->where('waktu_mulai', '>', now())->count();

        return [
            'pengajuan_menunggu' => $pengajuanCount,
            'ujian_akan_datang' => $ujianUpcomingCount,
        ];
    }

    /**
     * Approve Pengajuan
     *
     * @param int $id
     * @param string|null $catatan
     * @return bool
     */
    public function approvePengajuan(int $id, ?string $catatan = null)
    {
        $pengajuan = PengajuanRanpel::find($id);
        if (!$pengajuan) return false;

        $pengajuan->update([
            'status' => 'diterima',
            'catatan_kaprodi' => $catatan,
            'tanggal_diterima' => now(),
        ]);

        return true;
    }

    /**
     * Reject Pengajuan
     *
     * @param int $id
     * @param string|null $catatan
     * @return bool
     */
    public function rejectPengajuan(int $id, ?string $catatan = null)
    {
        $pengajuan = PengajuanRanpel::find($id);
        if (!$pengajuan) return false;

        $pengajuan->update([
            'status' => 'ditolak',
            'catatan_kaprodi' => $catatan,
            'tanggal_ditolak' => now(),
        ]);

        return true;
    }

    /**
     * Update Catatan Kaprodi
     *
     * @param int $id
     * @param string|null $catatan
     * @return bool
     */
    public function updateCatatan(int $id, ?string $catatan = null)
    {
        $pengajuan = PengajuanRanpel::find($id);
        if (!$pengajuan) return false;

        $pengajuan->update([
            'catatan_kaprodi' => $catatan,
        ]);

        return true;
    }
}
