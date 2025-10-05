<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSyaratRequest;
use App\Http\Requests\UpdateSyaratRequest;
use App\Http\Resources\SyaratResource;
use App\Models\Syarat;

class SyaratController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $syarat = Syarat::with(['jenis_ujian', 'pemenuhan_syarat'])->get();
        return SyaratResource::collection($syarat);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSyaratRequest $request)
    {
        $request->validated();
        $syarat = Syarat::create($request->all());
        return new SyaratResource($syarat);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $syarat = Syarat::with(['jenis_ujian', 'pemenuhan_syarat'])->findOrFail($id);
        return new SyaratResource($syarat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSyaratRequest $request, Syarat $syarat)
    {
        $request->validated();
        $syarat->update($request->all());

        return new SyaratResource($syarat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Syarat $syarat)
    {
        $syarat->delete();
        return response()->json(['message' => 'Syarat berhasil dihapus.'], 200);
    }
}
