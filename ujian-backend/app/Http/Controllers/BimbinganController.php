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
        $bimbingan = Bimbingan::with(['mahasiswa', 'skripsi', 'pembimbing1', 'pembimbing2'])->get();
        return BimbinganResource::collection($bimbingan);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBimbinganRequest $request)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bimbingan $bimbingan)
    {
        //
    }
}
