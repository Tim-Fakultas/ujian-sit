<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePengajuanRanpelRequest;
use App\Http\Requests\UpdatePengajuanRanpelRequest;
use App\Http\Resources\PengajuanRanpelResource;
use App\Models\PengajuanRanpel;

class PengajuanRanpelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengajuanRanpel = PengajuanRanpel::with(['ranpel', 'mahasiswa'])->get();
        return PengajuanRanpelResource::collection($pengajuanRanpel);
    }

    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePengajuanRanpelRequest $request)
    {
        $request->validated();
        $pengajuanRanpel = PengajuanRanpel::create($request->all());

        return new PengajuanRanpelResource($pengajuanRanpel);
    }

    /**
     * Display the specified resource.
     */
    public function show(PengajuanRanpel $pengajuanRanpel)
    {
        $pengajuanRanpel->load(['ranpel', 'mahasiswa']);

        return new PengajuanRanpelResource($pengajuanRanpel);
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePengajuanRanpelRequest $request, PengajuanRanpel $pengajuanRanpel)
    {
        $request->validated();
        $pengajuanRanpel->update($request->all());

        return new PengajuanRanpelResource($pengajuanRanpel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PengajuanRanpel $pengajuanRanpel)
    {
        $pengajuanRanpel->delete();
        return response()->json(['message' => 'Pengajuan Ranpel berhasil dihapus.'], 200);
    }

    //Get pengajuan ranpel by mahasiswa id
    public function getByMahasiswa($id)
    {
        $pengajuanRanpel = PengajuanRanpel::with(['ranpel', 'mahasiswa'])
            ->where('mahasiswa_id', $id)
            ->get();

        if ($pengajuanRanpel->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada pengajuan rancangan penelitian untuk mahasiswa ini.'
            ], 404);
        }

        return PengajuanRanpelResource::collection($pengajuanRanpel);
    }


    public function storeByMahasiswa(StorePengajuanRanpelRequest $request, $id)
    {
        $validated = $request->validated();

        $pengajuanRanpel = PengajuanRanpel::create([
            'mahasiswa_id' => $id,
            'ranpel_id' => $validated['ranpel_id'],
            'tanggal_pengajuan' => now(),
            'status' => 'menunggu',
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return new PengajuanRanpelResource($pengajuanRanpel->load(['ranpel', 'mahasiswa']));
    }

    public function updateByMahasiswa(UpdatePengajuanRanpelRequest $request, $id, PengajuanRanpel $pengajuan)
    {
        if ($pengajuan->mahasiswa_id != $id) {
            return response()->json(['message' => 'Data pengajuan tidak dimiliki oleh mahasiswa ini.'], 403);
        }

        $pengajuan->update($request->validated());

        return new PengajuanRanpelResource($pengajuan->load(['ranpel', 'mahasiswa']));
    }

    public function destroyByMahasiswa($id, PengajuanRanpel $pengajuan)
    {
        if ($pengajuan->mahasiswa_id != $id) {
            return response()->json(['message' => 'Data pengajuan tidak dimiliki oleh mahasiswa ini.'], 403);
        }

        $pengajuan->delete();

        return response()->json(['message' => 'Pengajuan rancangan penelitian berhasil dihapus.']);
    }




}
