<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePemenuhanSyaratRequest;
use App\Http\Requests\UpdatePemenuhanSyaratRequest;
use App\Http\Resources\PemenuhanSyaratResource;
use App\Models\PemenuhanSyarat;

class PemenuhanSyaratController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pemenuhanSyarat = PemenuhanSyarat::with(['pendaftaran_ujian', 'syarat'])->get();

        return PemenuhanSyaratResource::collection($pemenuhanSyarat);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemenuhanSyaratRequest $request)
    {
        $request->validated();
        $pemenuhanSyarat = PemenuhanSyarat::create($request->all());

        return new PemenuhanSyaratResource($pemenuhanSyarat);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pemenuhanSyarat = PemenuhanSyarat::with(['pendaftaran_ujian', 'syarat'])->findOrFail($id);

        return new PemenuhanSyaratResource($pemenuhanSyarat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemenuhanSyaratRequest $request, PemenuhanSyarat $pemenuhanSyarat)
    {
        $request->validated();
        $pemenuhanSyarat->update($request->all());

        return new PemenuhanSyaratResource($pemenuhanSyarat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PemenuhanSyarat $pemenuhanSyarat)
    {
        $pemenuhanSyarat->delete();

        return response()->json(['message' => 'Pemenuhan syarat berhasil dihapus.'], 200);
    }
}
