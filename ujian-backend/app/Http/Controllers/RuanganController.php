<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRuanganRequest;
use App\Http\Requests\UpdateRuanganRequest;
use App\Http\Resources\RuanganResource;
use App\Models\Ruangan;

/**
 * RuanganController — Mengelola data ruangan ujian.
 *
 * Menyediakan CRUD untuk entity Ruangan yang digunakan
 * untuk penjadwalan lokasi ujian.
 */
class RuanganController extends Controller
{
    /**
     * Tampilkan daftar semua ruangan beserta prodi terkait.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $ruangan = Ruangan::with('prodi')->get();

        return RuanganResource::collection($ruangan);
    }

    /**
     * Simpan data ruangan baru.
     *
     * @param  StoreRuanganRequest  $request
     * @return RuanganResource
     */
    public function store(StoreRuanganRequest $request)
    {
        $request->validated();

        $ruangan = Ruangan::create($request->only([
            'prodi_id',
            'nama_ruangan',
        ]));

        return new RuanganResource($ruangan);
    }

    /**
     * Tampilkan detail satu ruangan.
     *
     * @param  Ruangan  $ruangan
     * @return RuanganResource
     */
    public function show(Ruangan $ruangan)
    {
        return new RuanganResource($ruangan);
    }

    /**
     * Update data ruangan.
     *
     * @param  UpdateRuanganRequest  $request
     * @param  Ruangan  $ruangan
     * @return RuanganResource
     */
    public function update(UpdateRuanganRequest $request, Ruangan $ruangan)
    {
        $request->validated();

        $data = array_filter($request->only([
            'prodi_id',
            'nama_ruangan',
        ]));

        $ruangan->update($data);

        return new RuanganResource($ruangan);
    }

    /**
     * Hapus data ruangan.
     *
     * @param  Ruangan  $ruangan
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Ruangan $ruangan)
    {
        $ruangan->delete();

        return response()->json(['message' => 'Ruangan berhasil dihapus.'], 200);
    }
}
