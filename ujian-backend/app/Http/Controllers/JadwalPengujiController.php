<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJadwalPengujiRequest;
use App\Http\Requests\UpdateJadwalPengujiRequest;
use App\Http\Resources\JadwalPengujiResource;
use App\Models\JadwalPenguji;

class JadwalPengujiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jadwalPenguji = JadwalPenguji::with(['ujian', 'dosen'])->get();
        return JadwalPengujiResource::collection($jadwalPenguji);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJadwalPengujiRequest $request)
    {
        $request->validated();
        $jadwalPenguji = JadwalPenguji::create($request->all());
        return new JadwalPengujiResource($jadwalPenguji);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $jadwalPenguji = JadwalPenguji::with(['ujian', 'dosen'])->findOrFail($id);
        return new JadwalPengujiResource($jadwalPenguji);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJadwalPengujiRequest $request, JadwalPenguji $jadwalPenguji)
    {
        $request->validated();
        $jadwalPenguji->update($request->all());

        return new JadwalPengujiResource($jadwalPenguji);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JadwalPenguji $jadwalPenguji)
    {
        $jadwalPenguji->delete();
        return response()->json(['message' => 'Jadwal penguji berhasil dihapus.'], 200);
    }
}
