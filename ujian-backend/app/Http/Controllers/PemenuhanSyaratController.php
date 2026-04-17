<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePemenuhanSyaratRequest;
use App\Http\Requests\UpdatePemenuhanSyaratRequest;
use App\Http\Resources\PemenuhanSyaratResource;
use App\Models\PemenuhanSyarat;

/**
 * PemenuhanSyaratController — Mengelola verifikasi pemenuhan syarat ujian.
 *
 * Setiap pendaftaran ujian memiliki daftar syarat yang harus dipenuhi.
 * Controller ini mengelola status pemenuhan tiap syarat.
 */
class PemenuhanSyaratController extends Controller
{
    /**
     * Tampilkan daftar semua pemenuhan syarat.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return PemenuhanSyaratResource::collection(
            PemenuhanSyarat::with(['pendaftaranUjian', 'syarat'])->get()
        );
    }

    /**
     * Simpan pemenuhan syarat baru.
     *
     * @param  StorePemenuhanSyaratRequest  $request
     * @return PemenuhanSyaratResource
     */
    public function store(StorePemenuhanSyaratRequest $request)
    {
        $pemenuhanSyarat = PemenuhanSyarat::create($request->validated());

        return new PemenuhanSyaratResource($pemenuhanSyarat);
    }

    /**
     * Tampilkan detail satu pemenuhan syarat.
     *
     * @param  int  $id
     * @return PemenuhanSyaratResource
     */
    public function show($id)
    {
        return new PemenuhanSyaratResource(
            PemenuhanSyarat::with(['pendaftaranUjian', 'syarat'])->findOrFail($id)
        );
    }

    /**
     * Update pemenuhan syarat.
     *
     * @param  UpdatePemenuhanSyaratRequest  $request
     * @param  PemenuhanSyarat  $pemenuhanSyarat
     * @return PemenuhanSyaratResource
     */
    public function update(UpdatePemenuhanSyaratRequest $request, PemenuhanSyarat $pemenuhanSyarat)
    {
        $pemenuhanSyarat->update($request->validated());

        return new PemenuhanSyaratResource($pemenuhanSyarat);
    }

    /**
     * Hapus pemenuhan syarat.
     *
     * @param  PemenuhanSyarat  $pemenuhanSyarat
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(PemenuhanSyarat $pemenuhanSyarat)
    {
        $pemenuhanSyarat->delete();

        return response()->json(['message' => 'Pemenuhan syarat berhasil dihapus.'], 200);
    }
}
