<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePengajuanRanpelRequest;
use App\Http\Requests\UpdatePengajuanRanpelRequest;
use App\Http\Resources\PengajuanRanpelResource;
use App\Models\PengajuanRanpel;

/**
 * PengajuanRanpelController — Mengelola pengajuan rancangan penelitian.
 *
 * Menyediakan CRUD untuk entity PengajuanRanpel.
 * Mendukung operasi terikat mahasiswa (nested route) untuk
 * akses, pembuatan, dan penghapusan pengajuan.
 */
class PengajuanRanpelController extends Controller
{
    /** Relasi eager-load standar untuk pengajuan ranpel. */
    private const EAGER_RELATIONS = [
        'ranpel',
        'mahasiswa.prodi',
        'mahasiswa.peminatan',
        'mahasiswa.dosenPembimbingAkademik',
        'mahasiswa.pembimbing1',
        'mahasiswa.pembimbing2',
        'mahasiswa.user',
    ];

    /**
     * Tampilkan daftar semua pengajuan ranpel.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $pengajuanRanpel = PengajuanRanpel::with(self::EAGER_RELATIONS)->get();

        return PengajuanRanpelResource::collection($pengajuanRanpel);
    }

    /**
     * Simpan pengajuan ranpel baru.
     *
     * @param  StorePengajuanRanpelRequest  $request
     * @return PengajuanRanpelResource
     */
    public function store(StorePengajuanRanpelRequest $request)
    {
        $pengajuanRanpel = PengajuanRanpel::create($request->validated());

        return new PengajuanRanpelResource($pengajuanRanpel);
    }

    /**
     * Tampilkan detail satu pengajuan ranpel.
     *
     * @param  PengajuanRanpel  $pengajuanRanpel
     * @return PengajuanRanpelResource
     */
    public function show(PengajuanRanpel $pengajuanRanpel)
    {
        $pengajuanRanpel->load(self::EAGER_RELATIONS);

        return new PengajuanRanpelResource($pengajuanRanpel);
    }

    /**
     * Update pengajuan ranpel.
     *
     * @param  UpdatePengajuanRanpelRequest  $request
     * @param  PengajuanRanpel  $pengajuanRanpel
     * @return PengajuanRanpelResource
     */
    public function update(UpdatePengajuanRanpelRequest $request, PengajuanRanpel $pengajuanRanpel)
    {
        $pengajuanRanpel->update($request->validated());

        return new PengajuanRanpelResource($pengajuanRanpel);
    }

    /**
     * Hapus pengajuan ranpel.
     *
     * @param  PengajuanRanpel  $pengajuanRanpel
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(PengajuanRanpel $pengajuanRanpel)
    {
        $pengajuanRanpel->delete();

        return response()->json(['message' => 'Pengajuan ranpel berhasil dihapus.'], 200);
    }

    /**
     * Tampilkan pengajuan ranpel milik mahasiswa tertentu.
     *
     * @param  int  $id  ID Mahasiswa
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|\Illuminate\Http\JsonResponse
     */
    public function getByMahasiswa($id)
    {
        $pengajuanRanpel = PengajuanRanpel::with(self::EAGER_RELATIONS)
            ->where('mahasiswa_id', $id)
            ->get();

        if ($pengajuanRanpel->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada pengajuan rancangan penelitian untuk mahasiswa ini.',
            ], 404);
        }

        return PengajuanRanpelResource::collection($pengajuanRanpel);
    }

    /**
     * Simpan pengajuan ranpel oleh mahasiswa (via nested route).
     *
     * @param  StorePengajuanRanpelRequest  $request
     * @param  int  $id  ID Mahasiswa
     * @return PengajuanRanpelResource
     */
    public function storeByMahasiswa(StorePengajuanRanpelRequest $request, $id)
    {
        $validated = $request->validated();

        $pengajuanRanpel = PengajuanRanpel::create([
            'mahasiswa_id'      => $id,
            'ranpel_id'         => $validated['ranpel_id'],
            'tanggal_pengajuan' => now(),
            'status'            => 'menunggu',
            'keterangan'        => $validated['keterangan'] ?? null,
        ]);

        return new PengajuanRanpelResource($pengajuanRanpel->load(self::EAGER_RELATIONS));
    }

    /**
     * Update pengajuan ranpel oleh mahasiswa (via nested route).
     *
     * Memvalidasi kepemilikan data sebelum update.
     *
     * @param  UpdatePengajuanRanpelRequest  $request
     * @param  int  $id  ID Mahasiswa
     * @param  PengajuanRanpel  $pengajuan
     * @return PengajuanRanpelResource|\Illuminate\Http\JsonResponse
     */
    public function updateByMahasiswa(UpdatePengajuanRanpelRequest $request, $id, PengajuanRanpel $pengajuan)
    {
        if ($pengajuan->mahasiswa_id != $id) {
            return response()->json(['message' => 'Data pengajuan tidak dimiliki oleh mahasiswa ini.'], 403);
        }

        $pengajuan->update($request->validated());

        return new PengajuanRanpelResource($pengajuan->load(self::EAGER_RELATIONS));
    }

    /**
     * Hapus pengajuan ranpel oleh mahasiswa (via nested route).
     *
     * Memvalidasi kepemilikan data sebelum penghapusan.
     *
     * @param  int  $id  ID Mahasiswa
     * @param  PengajuanRanpel  $pengajuan
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyByMahasiswa($id, PengajuanRanpel $pengajuan)
    {
        if ($pengajuan->mahasiswa_id != $id) {
            return response()->json(['message' => 'Data pengajuan tidak dimiliki oleh mahasiswa ini.'], 403);
        }

        $pengajuan->delete();

        return response()->json(['message' => 'Pengajuan rancangan penelitian berhasil dihapus.']);
    }
}
