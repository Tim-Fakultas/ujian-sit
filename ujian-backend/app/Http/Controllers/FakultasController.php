<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFakultasRequest;
use App\Http\Requests\UpdateFakultasRequest;
use App\Http\Resources\FakultasResource;
use App\Models\Fakultas;

/**
 * FakultasController — Mengelola data fakultas.
 */
class FakultasController extends Controller
{
    /**
     * Tampilkan daftar semua fakultas.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return FakultasResource::collection(Fakultas::all());
    }

    /**
     * Simpan data fakultas baru.
     *
     * @param  StoreFakultasRequest  $request
     * @return FakultasResource
     */
    public function store(StoreFakultasRequest $request)
    {
        $fakultas = Fakultas::create($request->validated());

        return new FakultasResource($fakultas);
    }

    /**
     * Tampilkan detail satu fakultas.
     *
     * @param  int  $id
     * @return FakultasResource
     */
    public function show($id)
    {
        return new FakultasResource(Fakultas::findOrFail($id));
    }

    /**
     * Update data fakultas.
     *
     * @param  UpdateFakultasRequest  $request
     * @param  Fakultas  $fakultas
     * @return FakultasResource
     */
    public function update(UpdateFakultasRequest $request, Fakultas $fakultas)
    {
        $fakultas->update($request->validated());

        return new FakultasResource($fakultas->refresh());
    }

    /**
     * Hapus data fakultas.
     *
     * @param  Fakultas  $fakultas
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Fakultas $fakultas)
    {
        $fakultas->delete();

        return response()->json(['message' => 'Fakultas berhasil dihapus.'], 200);
    }
}
