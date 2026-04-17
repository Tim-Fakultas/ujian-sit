<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProdiRequest;
use App\Http\Requests\UpdateProdiRequest;
use App\Http\Resources\ProdiResource;
use App\Models\Prodi;

/**
 * ProdiController — Mengelola data program studi.
 */
class ProdiController extends Controller
{
    /**
     * Tampilkan daftar semua prodi beserta fakultas.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return ProdiResource::collection(Prodi::with('fakultas')->get());
    }

    /**
     * Simpan data prodi baru.
     *
     * @param  StoreProdiRequest  $request
     * @return ProdiResource
     */
    public function store(StoreProdiRequest $request)
    {
        $prodi = Prodi::create($request->validated());

        return new ProdiResource($prodi);
    }

    /**
     * Tampilkan detail satu prodi.
     *
     * @param  int  $id
     * @return ProdiResource
     */
    public function show($id)
    {
        return new ProdiResource(Prodi::findOrFail($id));
    }

    /**
     * Update data prodi.
     *
     * @param  UpdateProdiRequest  $request
     * @param  Prodi  $prodi
     * @return ProdiResource
     */
    public function update(UpdateProdiRequest $request, Prodi $prodi)
    {
        $prodi->update($request->validated());

        return new ProdiResource($prodi);
    }

    /**
     * Hapus data prodi.
     *
     * @param  Prodi  $prodi
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Prodi $prodi)
    {
        $prodi->delete();

        return response()->json(['message' => 'Prodi berhasil dihapus.'], 200);
    }
}
