<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDaftarKehadiranRequest;
use App\Http\Requests\UpdateDaftarKehadiranRequest;
use App\Http\Resources\DaftarKehadiranResource;
use App\Models\DaftarKehadiran;

/**
 * DaftarKehadiranController — Mengelola daftar kehadiran ujian.
 *
 * Mencatat kehadiran dosen (penguji/pembimbing) pada saat ujian berlangsung.
 */
class DaftarKehadiranController extends Controller
{
    /**
     * Tampilkan daftar semua kehadiran beserta ujian dan dosen.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return DaftarKehadiranResource::collection(
            DaftarKehadiran::with(['ujian', 'dosen'])->get()
        );
    }

    /**
     * Simpan data kehadiran baru.
     *
     * @param  StoreDaftarKehadiranRequest  $request
     * @return DaftarKehadiranResource
     */
    public function store(StoreDaftarKehadiranRequest $request)
    {
        $daftarHadir = DaftarKehadiran::create($request->only([
            'ujian_id', 'dosen_id', 'status_kehadiran', 'keterangan',
        ]));

        return new DaftarKehadiranResource($daftarHadir);
    }

    /**
     * Tampilkan detail satu kehadiran.
     *
     * @param  DaftarKehadiran  $daftar_hadir
     * @return DaftarKehadiranResource
     */
    public function show(DaftarKehadiran $daftar_hadir)
    {
        return new DaftarKehadiranResource($daftar_hadir);
    }

    /**
     * Update data kehadiran.
     *
     * @param  UpdateDaftarKehadiranRequest  $request
     * @param  DaftarKehadiran  $daftar_hadir
     * @return DaftarKehadiranResource
     */
    public function update(UpdateDaftarKehadiranRequest $request, DaftarKehadiran $daftar_hadir)
    {
        $daftar_hadir->update($request->validated());

        return new DaftarKehadiranResource($daftar_hadir);
    }

    /**
     * Hapus data kehadiran.
     *
     * @param  DaftarKehadiran  $daftar_hadir
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(DaftarKehadiran $daftar_hadir)
    {
        $daftar_hadir->delete();

        return response()->json(['message' => 'Daftar kehadiran berhasil dihapus.'], 200);
    }
}
