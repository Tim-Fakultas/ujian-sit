<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMahasiswaRequest;
use App\Http\Requests\UpdateMahasiswaRequest;
use App\Http\Resources\MahasiswaResource;
use App\Models\Mahasiswa;

class MahasiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mahasiswa = Mahasiswa::with(['prodi', 'peminatan', 'dosenPembimbingAkademik'])->get();

        return MahasiswaResource::collection($mahasiswa);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMahasiswaRequest $request)
    {
        $request->validated();
        $mahasiswa = Mahasiswa::create($request->all());

        return new MahasiswaResource($mahasiswa);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $mahasiswa = Mahasiswa::with(['prodi', 'peminatan', 'dosenPembimbingAkademik'])->findOrFail($id);

        return new MahasiswaResource($mahasiswa);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa)
    {
        $validated = $request->validated();

        // Handle dosen_id as alias for dosen_pa
        if (isset($validated['dosen_id'])) {
            $validated['dosen_pa'] = $validated['dosen_id'];
            unset($validated['dosen_id']);
        }

        $mahasiswa->update($validated);
        $mahasiswa->load(['prodi', 'peminatan', 'dosenPembimbingAkademik']);

        return new MahasiswaResource($mahasiswa);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mahasiswa $mahasiswa)
    {
        $mahasiswa->delete();

        return response()->json(['message' => 'Mahasiswa berhasil dihapus.'], 200);
    }
}
