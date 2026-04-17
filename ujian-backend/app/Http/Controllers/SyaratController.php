<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSyaratRequest;
use App\Http\Requests\UpdateSyaratRequest;
use App\Http\Resources\SyaratResource;
use App\Models\Syarat;
use Illuminate\Http\Request;

/**
 * SyaratController — Mengelola data syarat ujian.
 *
 * Setiap jenis ujian memiliki syarat yang harus dipenuhi mahasiswa.
 * Mendukung filter berdasarkan `jenis_ujian_id`.
 */
class SyaratController extends Controller
{
    /**
     * Tampilkan daftar syarat. Mendukung filter `jenis_ujian_id`.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $query = Syarat::with(['jenisUjian', 'pemenuhanSyarat']);

        if ($request->has('jenis_ujian_id')) {
            $query->where('jenis_ujian_id', $request->jenis_ujian_id);
        }

        return SyaratResource::collection($query->get());
    }

    /**
     * Simpan syarat baru.
     *
     * @param  StoreSyaratRequest  $request
     * @return SyaratResource
     */
    public function store(StoreSyaratRequest $request)
    {
        $syarat = Syarat::create($request->validated());

        return new SyaratResource($syarat);
    }

    /**
     * Tampilkan detail satu syarat.
     *
     * @param  int  $id
     * @return SyaratResource
     */
    public function show($id)
    {
        return new SyaratResource(
            Syarat::with(['jenisUjian', 'pemenuhanSyarat'])->findOrFail($id)
        );
    }

    /**
     * Update data syarat.
     *
     * @param  UpdateSyaratRequest  $request
     * @param  Syarat  $syarat
     * @return SyaratResource
     */
    public function update(UpdateSyaratRequest $request, Syarat $syarat)
    {
        $syarat->update($request->validated());

        return new SyaratResource($syarat);
    }

    /**
     * Hapus syarat.
     *
     * @param  Syarat  $syarat
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Syarat $syarat)
    {
        $syarat->delete();

        return response()->json(['message' => 'Syarat berhasil dihapus.'], 200);
    }
}
