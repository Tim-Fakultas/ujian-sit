<?php

namespace App\Http\Controllers\Kaprodi;

use App\Http\Controllers\Controller;
use App\Services\KaprodiService;
use Illuminate\Http\Request;

/**
 * DashboardController (Kaprodi) — Menyediakan data statistik dashboard.
 *
 * Menampilkan ringkasan: jumlah pengajuan menunggu,
 * jumlah ujian yang akan datang, dll.
 */
class DashboardController extends Controller
{
    protected KaprodiService $kaprodiService;

    public function __construct(KaprodiService $kaprodiService)
    {
        $this->kaprodiService = $kaprodiService;
    }

    /**
     * Ambil statistik dashboard Kaprodi berdasarkan prodi.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('kaprodi') || !$user->prodi_id) {
            return response()->json(['message' => 'Unauthorized atau Prodi ID tidak ditemukan.'], 403);
        }

        $stats = $this->kaprodiService->getDashboardStats($user->prodi_id);

        return response()->json($stats);
    }
}
