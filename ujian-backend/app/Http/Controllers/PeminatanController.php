<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePeminatanRequest;
use App\Http\Requests\UpdatePeminatanRequest;
use App\Http\Resources\PeminatanResource;
use App\Models\Peminatan;
use Illuminate\Http\Request;

/**
 * PeminatanController — Mengelola data peminatan (konsentrasi) per prodi.
 *
 * Mendukung filter berdasarkan `prodi_id` dan pencarian nama peminatan.
 */
class PeminatanController extends Controller
{
    /**
     * Tampilkan daftar peminatan.
     *
     * Mendukung filter: `prodi_id`, `search` (nama peminatan).
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $query = Peminatan::with('prodi');

        if ($request->has('prodi_id')) {
            $query->where('prodi_id', $request->prodi_id);
        }

        if ($request->has('search')) {
            $query->where('nama_peminatan', 'like', '%' . $request->search . '%');
        }

        return PeminatanResource::collection($query->get());
    }

    /**
     * Simpan peminatan baru.
     *
     * @param  StorePeminatanRequest  $request
     * @return PeminatanResource
     */
    public function store(StorePeminatanRequest $request)
    {
        $peminatan = Peminatan::create($request->validated());
        $peminatan->load('prodi');

        return new PeminatanResource($peminatan);
    }

    /**
     * Tampilkan detail satu peminatan.
     *
     * @param  Peminatan  $peminatan
     * @return PeminatanResource
     */
    public function show(Peminatan $peminatan)
    {
        $peminatan->load('prodi');

        return new PeminatanResource($peminatan);
    }

    /**
     * Update data peminatan.
     *
     * @param  UpdatePeminatanRequest  $request
     * @param  Peminatan  $peminatan
     * @return PeminatanResource
     */
    public function update(UpdatePeminatanRequest $request, Peminatan $peminatan)
    {
        $peminatan->update($request->validated());
        $peminatan->load('prodi');

        return new PeminatanResource($peminatan);
    }

    /**
     * Hapus peminatan.
     *
     * @param  Peminatan  $peminatan
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Peminatan $peminatan)
    {
        $peminatan->delete();

        return response()->json(['message' => 'Peminatan berhasil dihapus.']);
    }
}
