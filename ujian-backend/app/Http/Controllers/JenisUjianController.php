<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJenisUjianRequest;
use App\Http\Requests\UpdateJenisUjianRequest;
use App\Http\Resources\JenisUjianResource;
use App\Models\JenisUjian;

/**
 * JenisUjianController — Mengelola data jenis ujian.
 *
 * Jenis ujian: Seminar Proposal, Ujian Hasil, Ujian Skripsi.
 */
class JenisUjianController extends Controller
{
    /**
     * Tampilkan daftar semua jenis ujian.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return JenisUjianResource::collection(JenisUjian::all());
    }

    /**
     * Simpan jenis ujian baru.
     *
     * @param  StoreJenisUjianRequest  $request
     * @return JenisUjianResource
     */
    public function store(StoreJenisUjianRequest $request)
    {
        $jenisUjian = JenisUjian::create($request->validated());

        return new JenisUjianResource($jenisUjian);
    }

    /**
     * Tampilkan detail satu jenis ujian.
     *
     * @param  int  $id
     * @return JenisUjianResource
     */
    public function show($id)
    {
        return new JenisUjianResource(JenisUjian::findOrFail($id));
    }

    /**
     * Update data jenis ujian.
     *
     * @param  UpdateJenisUjianRequest  $request
     * @param  JenisUjian  $jenisUjian
     * @return JenisUjianResource
     */
    public function update(UpdateJenisUjianRequest $request, JenisUjian $jenisUjian)
    {
        $jenisUjian->update($request->validated());

        return new JenisUjianResource($jenisUjian);
    }

    /**
     * Hapus jenis ujian.
     *
     * @param  JenisUjian  $jenisUjian
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(JenisUjian $jenisUjian)
    {
        $jenisUjian->delete();

        return response()->json(['message' => 'Jenis ujian berhasil dihapus.'], 200);
    }
}
