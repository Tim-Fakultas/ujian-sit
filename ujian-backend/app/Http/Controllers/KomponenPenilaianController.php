<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKomponenPenilaianRequest;
use App\Http\Requests\UpdateKomponenPenilaianRequest;
use App\Http\Resources\KomponenPenilaianResource;
use App\Models\KomponenPenilaian;

class KomponenPenilaianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $komponenPenilaian = KomponenPenilaian::with(['jenisUjian'])->get();

        return KomponenPenilaianResource::collection($komponenPenilaian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKomponenPenilaianRequest $request)
    {
        $request->validated();
        $komponenPenilaian = KomponenPenilaian::create($request->all());

        return new KomponenPenilaianResource($komponenPenilaian);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $komponenPenilaian = KomponenPenilaian::with(['jenisUjian'])->findOrFail($id);

        return new KomponenPenilaianResource($komponenPenilaian);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKomponenPenilaianRequest $request, KomponenPenilaian $komponenPenilaian)
    {
        $request->validated();
        $komponenPenilaian->update($request->only([
            'nama_komponen',
            'deskripsi',
            'bobot',
        ]));

        return new KomponenPenilaianResource($komponenPenilaian);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KomponenPenilaian $komponenPenilaian)
    {
        $komponenPenilaian->delete();

        return response()->json(['message' => 'Komponen penilaian berhasil dihapus.'], 200);
    }
}
