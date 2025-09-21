<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSkripsiRequest;
use App\Http\Requests\UpdateSkripsiRequest;
use App\Http\Resources\SkripsiResource;
use App\Models\Skripsi;

class SkripsiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $skripsi = Skripsi::all();
        return SkripsiResource::collection($skripsi);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSkripsiRequest $request)
    {
        $request->validated();
        $skripsi = Skripsi::create($request->all());
        return new SkripsiResource($skripsi);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $skripsi = Skripsi::findOrFail($id);
        return new SkripsiResource($skripsi);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSkripsiRequest $request, Skripsi $skripsi)
    {
        $request->validated();
        $skripsi->update($request->all());

        return new SkripsiResource($skripsi);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skripsi $skripsi)
    {
        $skripsi->delete();
        return response()->json(['message' => 'Skripsi berhasil dihapus.'], 200);
    }
}
