<?php

namespace App\Http\Controllers\Kaprodi;

use App\Http\Controllers\Controller;
use App\Http\Resources\PengajuanRanpelResource;
use App\Services\KaprodiService;
use Illuminate\Http\Request;

class PengajuanRanpelController extends Controller
{
    protected $kaprodiService;

    public function __construct(KaprodiService $kaprodiService)
    {
        $this->kaprodiService = $kaprodiService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        // Ensure user is Kaprodi and has prodi_id
        if (!$user->hasRole('kaprodi') || !$user->prodi_id) {
            return response()->json(['message' => 'Unauthorized or Prodi ID missing.'], 403);
        }

        $pengajuan = $this->kaprodiService->getPengajuanByProdi($user->prodi_id);

        return PengajuanRanpelResource::collection($pengajuan);
    }
    public function approve(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->hasRole('kaprodi')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'catatan_kaprodi' => 'nullable|string'
        ]);

        $success = $this->kaprodiService->approvePengajuan($id, $validated['catatan_kaprodi'] ?? null);

        if (!$success) {
            return response()->json(['message' => 'Pengajuan not found'], 404);
        }

        return response()->json(['message' => 'Pengajuan approved successfully']);
    }

    public function reject(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->hasRole('kaprodi')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'catatan_kaprodi' => 'nullable|string'
        ]);

        $success = $this->kaprodiService->rejectPengajuan($id, $validated['catatan_kaprodi'] ?? null);

        if (!$success) {
            return response()->json(['message' => 'Pengajuan not found'], 404);
        }

        return response()->json(['message' => 'Pengajuan rejected successfully']);
    }

    public function updateCatatan(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->hasRole('kaprodi')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'catatan_kaprodi' => 'nullable|string'
        ]);

        $success = $this->kaprodiService->updateCatatan($id, $validated['catatan_kaprodi'] ?? null);

        if (!$success) {
            return response()->json(['message' => 'Pengajuan not found'], 404);
        }

        return response()->json(['message' => 'Catatan updated successfully']);
    }
}
