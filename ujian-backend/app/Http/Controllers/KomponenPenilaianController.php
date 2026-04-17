<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKomponenPenilaianRequest;
use App\Http\Requests\UpdateKomponenPenilaianRequest;
use App\Http\Resources\KomponenPenilaianResource;
use App\Models\KomponenPenilaian;

/**
 * KomponenPenilaianController — Mengelola komponen penilaian ujian.
 *
 * Setiap jenis ujian memiliki komponen penilaian dengan bobot tertentu
 * (contoh: Isi Materi 30%, Presentasi 20%, dll).
 */
class KomponenPenilaianController extends Controller
{
    /**
     * Tampilkan daftar semua komponen penilaian.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return KomponenPenilaianResource::collection(
            KomponenPenilaian::with('jenisUjian')->get()
        );
    }

    /**
     * Simpan komponen penilaian baru.
     *
     * @param  StoreKomponenPenilaianRequest  $request
     * @return KomponenPenilaianResource
     */
    public function store(StoreKomponenPenilaianRequest $request)
    {
        $komponenPenilaian = KomponenPenilaian::create($request->validated());

        return new KomponenPenilaianResource($komponenPenilaian);
    }

    /**
     * Tampilkan detail satu komponen penilaian.
     *
     * @param  int  $id
     * @return KomponenPenilaianResource
     */
    public function show($id)
    {
        return new KomponenPenilaianResource(
            KomponenPenilaian::with('jenisUjian')->findOrFail($id)
        );
    }

    /**
     * Update komponen penilaian (hanya nama, deskripsi, bobot).
     *
     * @param  UpdateKomponenPenilaianRequest  $request
     * @param  KomponenPenilaian  $komponenPenilaian
     * @return KomponenPenilaianResource
     */
    public function update(UpdateKomponenPenilaianRequest $request, KomponenPenilaian $komponenPenilaian)
    {
        $komponenPenilaian->update($request->only([
            'nama_komponen', 'deskripsi', 'bobot',
        ]));

        return new KomponenPenilaianResource($komponenPenilaian);
    }

    /**
     * Hapus komponen penilaian.
     *
     * @param  KomponenPenilaian  $komponenPenilaian
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(KomponenPenilaian $komponenPenilaian)
    {
        $komponenPenilaian->delete();

        return response()->json(['message' => 'Komponen penilaian berhasil dihapus.'], 200);
    }
}
