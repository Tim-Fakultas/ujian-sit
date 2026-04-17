<?php

namespace App\Http\Controllers\Kaprodi;

use App\Http\Controllers\Controller;
use App\Http\Resources\UjianResource;
use App\Services\KaprodiService;
use Illuminate\Http\Request;

/**
 * JadwalUjianController (Kaprodi) — Menampilkan jadwal ujian per prodi.
 *
 * Kaprodi dapat melihat seluruh jadwal ujian mahasiswa di prodi-nya.
 */
class JadwalUjianController extends Controller
{
    protected KaprodiService $kaprodiService;

    public function __construct(KaprodiService $kaprodiService)
    {
        $this->kaprodiService = $kaprodiService;
    }

    /**
     * Tampilkan jadwal ujian berdasarkan prodi Kaprodi.
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

        $jadwal = $this->kaprodiService->getJadwalUjianByProdi($user->prodi_id);

        return UjianResource::collection($jadwal);
    }
}
