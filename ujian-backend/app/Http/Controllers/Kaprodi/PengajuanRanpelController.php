<?php

namespace App\Http\Controllers\Kaprodi;

use App\Http\Controllers\Controller;
use App\Http\Resources\PengajuanRanpelResource;
use App\Services\KaprodiService;
use Illuminate\Http\Request;

/**
 * PengajuanRanpelController (Kaprodi) — Mengelola pengajuan ranpel dari sisi Kaprodi.
 *
 * Kaprodi dapat melihat, menyetujui, menolak, dan memberikan catatan
 * pada pengajuan ranpel mahasiswa di prodi yang sama.
 */
class PengajuanRanpelController extends Controller
{
    protected KaprodiService $kaprodiService;

    public function __construct(KaprodiService $kaprodiService)
    {
        $this->kaprodiService = $kaprodiService;
    }

    /**
     * Tampilkan daftar pengajuan ranpel berdasarkan prodi Kaprodi.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('kaprodi') || !$user->prodi_id) {
            return response()->json(['message' => 'Unauthorized atau Prodi ID tidak ditemukan.'], 403);
        }

        $pengajuan = $this->kaprodiService->getPengajuanByProdi($user->prodi_id);

        return PengajuanRanpelResource::collection($pengajuan);
    }

    /**
     * Setujui pengajuan ranpel.
     *
     * @param  Request  $request
     * @param  int  $id  ID Pengajuan Ranpel
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->hasRole('kaprodi')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'catatan_kaprodi' => 'nullable|string',
        ]);

        $success = $this->kaprodiService->approvePengajuan($id, $validated['catatan_kaprodi'] ?? null);

        if (!$success) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Pengajuan berhasil disetujui']);
    }

    /**
     * Tolak pengajuan ranpel.
     *
     * @param  Request  $request
     * @param  int  $id  ID Pengajuan Ranpel
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->hasRole('kaprodi')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'catatan_kaprodi' => 'nullable|string',
        ]);

        $success = $this->kaprodiService->rejectPengajuan($id, $validated['catatan_kaprodi'] ?? null);

        if (!$success) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Pengajuan berhasil ditolak']);
    }

    /**
     * Update catatan Kaprodi pada pengajuan ranpel.
     *
     * @param  Request  $request
     * @param  int  $id  ID Pengajuan Ranpel
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCatatan(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->hasRole('kaprodi')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'catatan_kaprodi' => 'nullable|string',
        ]);

        $success = $this->kaprodiService->updateCatatan($id, $validated['catatan_kaprodi'] ?? null);

        if (!$success) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Catatan berhasil diperbarui']);
    }
}
