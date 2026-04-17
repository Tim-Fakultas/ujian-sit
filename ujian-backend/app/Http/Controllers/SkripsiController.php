<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSkripsiRequest;
use App\Http\Requests\UpdateSkripsiRequest;
use App\Http\Resources\SkripsiResource;
use App\Models\Skripsi;

/**
 * SkripsiController — Mengelola data skripsi.
 */
class SkripsiController extends Controller
{
    /**
     * Tampilkan daftar semua skripsi.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return SkripsiResource::collection(Skripsi::all());
    }

    /**
     * Simpan data skripsi baru.
     *
     * @param  StoreSkripsiRequest  $request
     * @return SkripsiResource
     */
    public function store(StoreSkripsiRequest $request)
    {
        $skripsi = Skripsi::create($request->validated());

        return new SkripsiResource($skripsi);
    }

    /**
     * Tampilkan detail satu skripsi.
     *
     * @param  int  $id
     * @return SkripsiResource
     */
    public function show($id)
    {
        return new SkripsiResource(Skripsi::findOrFail($id));
    }

    /**
     * Update data skripsi.
     *
     * @param  UpdateSkripsiRequest  $request
     * @param  Skripsi  $skripsi
     * @return SkripsiResource
     */
    public function update(UpdateSkripsiRequest $request, Skripsi $skripsi)
    {
        $skripsi->update($request->validated());

        return new SkripsiResource($skripsi);
    }

    /**
     * Hapus data skripsi.
     *
     * @param  Skripsi  $skripsi
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Skripsi $skripsi)
    {
        $skripsi->delete();

        return response()->json(['message' => 'Skripsi berhasil dihapus.'], 200);
    }
}
