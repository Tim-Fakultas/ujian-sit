<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBerkasRequest;
use App\Http\Requests\UpdateBerkasRequest;
use App\Http\Resources\BerkasResource;
use App\Models\Berkas;

/**
 * BerkasController — Mengelola data berkas/dokumen pendaftaran ujian.
 */
class BerkasController extends Controller
{
    /**
     * Tampilkan daftar semua berkas.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return BerkasResource::collection(Berkas::all());
    }

    /**
     * Simpan berkas baru.
     *
     * @param  StoreBerkasRequest  $request
     * @return BerkasResource
     */
    public function store(StoreBerkasRequest $request)
    {
        $berkas = Berkas::create($request->validated());

        return new BerkasResource($berkas);
    }

    /**
     * Tampilkan detail satu berkas.
     *
     * @param  Berkas  $berkas
     * @return BerkasResource
     */
    public function show(Berkas $berkas)
    {
        return new BerkasResource($berkas);
    }

    /**
     * Update data berkas.
     *
     * @param  UpdateBerkasRequest  $request
     * @param  Berkas  $berkas
     * @return BerkasResource
     */
    public function update(UpdateBerkasRequest $request, Berkas $berkas)
    {
        $berkas->update($request->validated());

        return new BerkasResource($berkas);
    }

    /**
     * Hapus berkas.
     *
     * @param  Berkas  $berkas
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Berkas $berkas)
    {
        $berkas->delete();

        return response()->json(['message' => 'Berkas berhasil dihapus.'], 200);
    }
}
