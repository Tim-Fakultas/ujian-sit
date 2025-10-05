<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePendaftaranUjianRequest;
use App\Http\Requests\UpdatePendaftaranUjianRequest;
use App\Http\Resources\PendaftaranUjianResource;
use App\Models\PendaftaranUjian;

class PendaftaranUjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pendaftaranUjian = PendaftaranUjian::with(['mahasiswa', 'jenis_ujian', 'skripsi'])->get();

        return PendaftaranUjianResource::collection($pendaftaranUjian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePendaftaranUjianRequest $request)
    {
        $request->validated();
        $pendaftaranUjian = PendaftaranUjian::create($request->all());

        return new PendaftaranUjianResource($pendaftaranUjian);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pendaftaranUjian = PendaftaranUjian::with(['mahasiswa', 'jenis_ujian', 'skripsi'])->findOrFail($id);

        return new PendaftaranUjianResource($pendaftaranUjian);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePendaftaranUjianRequest $request, PendaftaranUjian $pendaftaranUjian)
    {
        $request->validated();
        $pendaftaranUjian->update($request->all());

        return new PendaftaranUjianResource($pendaftaranUjian);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PendaftaranUjian $pendaftaranUjian)
    {
        $pendaftaranUjian->delete();

        return response()->json(['message' => 'Pendaftaran ujian berhasil dihapus.'], 200);
    }
}
