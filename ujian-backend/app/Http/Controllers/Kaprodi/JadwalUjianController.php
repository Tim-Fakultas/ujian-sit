<?php

namespace App\Http\Controllers\Kaprodi;

use App\Http\Controllers\Controller;
use App\Http\Resources\UjianResource;
use App\Services\KaprodiService;
use Illuminate\Http\Request;

class JadwalUjianController extends Controller
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

        $jadwal = $this->kaprodiService->getJadwalUjianByProdi($user->prodi_id);

        return UjianResource::collection($jadwal);
    }
}
