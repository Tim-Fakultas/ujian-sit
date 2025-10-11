<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePengajuanJudulRequest;
use App\Http\Requests\UpdatePengajuanJudulRequest;
use App\Http\Resources\PengajuanJudulResource;
use App\Models\PengajuanJudul;

class PengajuanJudulController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengajuanJudul = PengajuanJudul::with(['mahasiswa', 'dosen'])->get();

        return PengajuanJudulResource::collection($pengajuanJudul);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePengajuanJudulRequest $request)
    {
        $request->validated();
        $pengajuanJudul = PengajuanJudul::create($request->all());


        if ($request->hasFile('file_path')) {
            $path = $request->file('file_path')->store('uploads/proposals');
            $pengajuanJudul->update(['file_path' => $path]);
        }

        return new PengajuanJudulResource($pengajuanJudul);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pengajuanJudul = PengajuanJudul::with(['mahasiswa', 'dosen'])->findOrFail($id);

        return new PengajuanJudulResource($pengajuanJudul);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePengajuanJudulRequest $request, PengajuanJudul $pengajuanJudul)
    {
        $request->validated();
        $pengajuanJudul->update($request->all());

        return new PengajuanJudulResource($pengajuanJudul);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PengajuanJudul $pengajuanJudul)
    {
        $pengajuanJudul->delete();

        return response()->json(['message' => 'PengajuanJudul berhasil dihapus.'], 200);
    }
}
