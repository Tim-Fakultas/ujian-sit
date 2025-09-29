<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUjianRequest;
use App\Http\Requests\UpdateUjianRequest;
use App\Http\Resources\UjianResource;
use App\Models\Ujian;

class UjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ujian = Ujian::with(['pendaftaran_ujian', 'jenis_ujian', 'mahasiswa', 'penilaian'])->get();
        return UjianResource::collection($ujian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUjianRequest $request)
    {
        $request->validated();
        $ujian = Ujian::create($request->all());
        return new UjianResource($ujian);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ujian = Ujian::with(['pendaftaran', 'jenisUjian', 'mahasiswa', 'penilaian'])->findOrFail($id);
        return new UjianResource($ujian);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUjianRequest $request, Ujian $ujian)
    {
        $request->validated();
        $ujian->update($request->all());

        return new UjianResource($ujian);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ujian $ujian)
    {
        $ujian->delete();
        return response()->json(['message' => 'Ujian berhasil dihapus.'], 200);
    }
}
