<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRanpelRequest;
use App\Http\Requests\UpdateRanpelRequest;
use App\Http\Resources\RanpelResource;
use App\Models\PengajuanRanpel;
use App\Models\Ranpel;

class RanpelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ranpel = Ranpel::get();

        return RanpelResource::collection($ranpel);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRanpelRequest $request)
    {
        $validated = $request->validated();
        $ranpelData = $request->only([
            'judul_penelitian',
            'masalah_dan_penyebab',
            'alternatif_solusi',
            'metode_penelitian',
            'hasil_yang_diharapkan',
            'kebutuhan_data',
        ]);
        $ranpel = Ranpel::create($ranpelData);

        return new RanpelResource($ranpel);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ranpel = Ranpel::findOrFail($id);

        return new RanpelResource($ranpel);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRanpelRequest $request, Ranpel $ranpel)
    {
        $request->validated();
        $ranpel->update($request->all());

        return new RanpelResource($ranpel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ranpel $ranpel)
    {
        $ranpel->delete();

        return response()->json(['message' => 'Ranpel berhasil dihapus.'], 200);
    }

    public function getByMahasiswa($id)
    {
        $ranpel = Ranpel::whereHas('pengajuanRanpel', function ($query) use ($id) {$query->where('mahasiswa_id', $id);})->get();

        if ($ranpel->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada pengajuan rancangan penelitian untuk mahasiswa ini.'
            ], 404);
        }

        return RanpelResource::collection($ranpel);
    }

    public function storeByMahasiswa(StoreRanpelRequest $request, $id)
    {
        $request->validated();
        $ranpelData = $request->only([
            'judul_penelitian',
            'masalah_dan_penyebab',
            'alternatif_solusi',
            'metode_penelitian',
            'hasil_yang_diharapkan',
            'kebutuhan_data',
        ]);

        $ranpel = Ranpel::create($ranpelData);

        PengajuanRanpel::create([
            'ranpel_id' => $ranpel->id,
            'mahasiswa_id' => $id ?? $request->input('mahasiswa_id'), // fleksibel, tergantung login
            'tanggalPengajuan' => now(),
            'status' => 'menunggu',
            'keterangan' => '',
        ]);

        return new RanpelResource($ranpel);
    }

    // public function updateByMahasiswa(UpdateRanpelRequest $request, Ranpel $ranpel)
    // {
    //     $request->validated();
    //     $ranpel->update($request->all());

    //     return new RanpelResource($ranpel);
    // }

    // public function destroyByMahasiswa(Ranpel $ranpel)
    // {
    //     $ranpel->delete();

    //     return response()->json(['message' => 'Ranpel berhasil dihapus.'], 200);
    // }

}
