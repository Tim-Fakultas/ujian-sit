<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRanpelRequest;
use App\Http\Requests\UpdateRanpelRequest;
use App\Http\Resources\RanpelResource;
use App\Models\PengajuanRanpel;
use App\Models\Ranpel;

/**
 * RanpelController — Mengelola data Rancangan Penelitian (Ranpel).
 *
 * Menyediakan CRUD untuk entity Ranpel serta operasi yang terikat
 * pada mahasiswa tertentu (storeByMahasiswa, updateByMahasiswa).
 * Saat mahasiswa membuat ranpel baru, otomatis dibuat juga record
 * pengajuan ranpel dengan status "menunggu".
 */
class RanpelController extends Controller
{
    /** Field yang diizinkan untuk disimpan/update ke tabel ranpel. */
    private const RANPEL_FIELDS = [
        'judul_penelitian',
        'masalah_dan_penyebab',
        'alternatif_solusi',
        'metode_penelitian',
        'hasil_yang_diharapkan',
        'kebutuhan_data',
        'jurnal_referensi',
    ];

    /**
     * Tampilkan daftar semua ranpel.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return RanpelResource::collection(Ranpel::all());
    }

    /**
     * Simpan ranpel baru.
     *
     * @param  StoreRanpelRequest  $request
     * @return RanpelResource
     */
    public function store(StoreRanpelRequest $request)
    {
        $ranpel = Ranpel::create($request->only(self::RANPEL_FIELDS));

        return new RanpelResource($ranpel);
    }

    /**
     * Tampilkan detail satu ranpel.
     *
     * @param  int  $id
     * @return RanpelResource
     */
    public function show($id)
    {
        return new RanpelResource(Ranpel::findOrFail($id));
    }

    /**
     * Update data ranpel.
     *
     * @param  UpdateRanpelRequest  $request
     * @param  Ranpel  $ranpel
     * @return RanpelResource
     */
    public function update(UpdateRanpelRequest $request, Ranpel $ranpel)
    {
        $ranpel->update($request->validated());

        return new RanpelResource($ranpel);
    }

    /**
     * Hapus data ranpel.
     *
     * @param  Ranpel  $ranpel
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Ranpel $ranpel)
    {
        $ranpel->delete();

        return response()->json(['message' => 'Ranpel berhasil dihapus.'], 200);
    }

    /**
     * Tampilkan daftar ranpel milik mahasiswa tertentu.
     *
     * Mengambil ranpel yang terhubung melalui tabel pengajuan_ranpel.
     *
     * @param  int  $id  ID Mahasiswa
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|\Illuminate\Http\JsonResponse
     */
    public function getByMahasiswa($id)
    {
        $ranpel = Ranpel::whereHas('pengajuanRanpel', function ($query) use ($id) {
            $query->where('mahasiswa_id', $id);
        })->get();

        if ($ranpel->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada pengajuan rancangan penelitian untuk mahasiswa ini.',
            ], 404);
        }

        return RanpelResource::collection($ranpel);
    }

    /**
     * Simpan ranpel baru oleh mahasiswa (via nested route).
     *
     * Otomatis membuat record PengajuanRanpel dengan status "menunggu"
     * yang mengaitkan ranpel dengan mahasiswa.
     *
     * @param  StoreRanpelRequest  $request
     * @param  int  $id  ID Mahasiswa
     * @return RanpelResource
     */
    public function storeByMahasiswa(StoreRanpelRequest $request, $id)
    {
        $request->validated();

        $ranpel = Ranpel::create($request->only(self::RANPEL_FIELDS));

        PengajuanRanpel::create([
            'ranpel_id'         => $ranpel->id,
            'mahasiswa_id'      => $id ?? $request->input('mahasiswa_id'),
            'tanggal_pengajuan'  => now(),
            'status'            => 'menunggu',
            'keterangan'        => '',
        ]);

        return new RanpelResource($ranpel);
    }

    /**
     * Update ranpel oleh mahasiswa (via nested route).
     *
     * @param  UpdateRanpelRequest  $request
     * @param  int  $id  ID Mahasiswa
     * @param  Ranpel  $ranpel
     * @return RanpelResource
     */
    public function updateByMahasiswa(UpdateRanpelRequest $request, $id, Ranpel $ranpel)
    {
        $ranpel->update($request->only(self::RANPEL_FIELDS));

        return new RanpelResource($ranpel);
    }
}
