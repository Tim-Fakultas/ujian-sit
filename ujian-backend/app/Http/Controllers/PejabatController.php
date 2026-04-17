<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePejabatRequest;
use App\Http\Requests\UpdatePejabatRequest;
use App\Http\Resources\PejabatResource;
use App\Models\Pejabat;

/**
 * PejabatController — Mengelola data pejabat struktural.
 */
class PejabatController extends Controller
{
    /**
     * Tampilkan daftar semua pejabat.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return PejabatResource::collection(Pejabat::all());
    }

    /**
     * Simpan data pejabat baru.
     *
     * @param  StorePejabatRequest  $request
     * @return PejabatResource
     */
    public function store(StorePejabatRequest $request)
    {
        $pejabat = Pejabat::create($request->validated());

        return new PejabatResource($pejabat);
    }

    /**
     * Tampilkan detail satu pejabat.
     *
     * @param  int  $id
     * @return PejabatResource
     */
    public function show($id)
    {
        return new PejabatResource(Pejabat::findOrFail($id));
    }

    /**
     * Update data pejabat.
     *
     * @param  UpdatePejabatRequest  $request
     * @param  Pejabat  $pejabat
     * @return PejabatResource
     */
    public function update(UpdatePejabatRequest $request, Pejabat $pejabat)
    {
        $pejabat->update($request->validated());

        return new PejabatResource($pejabat);
    }

    /**
     * Hapus data pejabat.
     *
     * @param  Pejabat  $pejabat
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Pejabat $pejabat)
    {
        $pejabat->delete();

        return response()->json(['message' => 'Pejabat berhasil dihapus.'], 200);
    }
}
