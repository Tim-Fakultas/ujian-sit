<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePenilaianRequest;
use App\Http\Requests\UpdatePenilaianRequest;
use App\Http\Resources\PenilaianResource;
use App\Models\Penilaian;

class PenilaianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $penilaian = Penilaian::with(['ujian', 'dosen', 'komponen_penilaian'])->get();

        return PenilaianResource::collection($penilaian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePenilaianRequest $request)
    {
        $request->validated();
        $penilaian = Penilaian::create($request->all());

        return new PenilaianResource($penilaian);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $penilaian = Penilaian::with(['ujian', 'dosen', 'komponen_penilaian'])->findOrFail($id);

        return new PenilaianResource($penilaian);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePenilaianRequest $request, Penilaian $penilaian)
    {
        $request->validated();
        $penilaian->update($request->all());

        return new PenilaianResource($penilaian);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Penilaian $penilaian)
    {
        $penilaian->delete();

        return response()->json(['message' => 'Penilaian berhasil dihapus.'], 200);
    }
}
