<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePengajuanRequest;
use App\Http\Requests\UpdatePengajuanRequest;
use App\Http\Resources\PengajuanResource;
use App\Models\Pengajuan;

class PengajuanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengajuan = Pengajuan::with(['mahasiswa', 'skripsi', 'dosen'])->get();
        return PengajuanResource::collection($pengajuan);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePengajuanRequest $request)
    {
        $request->validated();
        $pengajuan = Pengajuan::create($request->all());
        return new PengajuanResource($pengajuan);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pengajuan = Pengajuan::findOrFail($id);
        return new PengajuanResource($pengajuan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePengajuanRequest $request, Pengajuan $pengajuan)
    {
        $request->validated();
        $pengajuan->update($request->all());

        return new PengajuanResource($pengajuan);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengajuan $pengajuan)
    {
        $pengajuan->delete();
        return response()->json(['message' => 'Pengajuan berhasil dihapus.'], 200);
    }
}
