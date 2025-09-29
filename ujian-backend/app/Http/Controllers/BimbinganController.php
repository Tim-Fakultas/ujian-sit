<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBimbinganRequest;
use App\Http\Requests\UpdateBimbinganRequest;
use App\Http\Resources\BimbinganResource;
use App\Models\Bimbingan;

class BimbinganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bimbingan = Bimbingan::with(['skripsi', 'dosen', 'mahasiswa'])->get();
        return BimbinganResource::collection($bimbingan);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBimbinganRequest $request)
    {
        $request->validated();
        $bimbingan = Bimbingan::create($request->all());
        return new BimbinganResource($bimbingan);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $bimbingan = Bimbingan::findOrFail($id);
        return new BimbinganResource($bimbingan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBimbinganRequest $request, Bimbingan $bimbingan)
    {
        $request->validated();
        $bimbingan->update($request->all());

        return new BimbinganResource($bimbingan);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bimbingan $bimbingan)
    {
        $bimbingan->delete();
        return response()->json(['message' => 'Bimbingan berhasil dihapus.'], 200);
    }
}
