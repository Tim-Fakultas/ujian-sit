<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePeminatanRequest;
use App\Http\Requests\UpdatePeminatanRequest;
use App\Http\Resources\PeminatanResource;
use App\Models\Peminatan;
use Illuminate\Http\Request;

class PeminatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Peminatan::with('prodi');

        // Filter by prodi_id if provided
        if ($request->has('prodi_id')) {
            $query->where('prodi_id', $request->prodi_id);
        }

        // Search by nama_peminatan
        if ($request->has('search')) {
            $query->where('nama_peminatan', 'like', '%' . $request->search . '%');
        }

        $peminatan = $query->get();

        return PeminatanResource::collection($peminatan);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePeminatanRequest $request)
    {
        $peminatan = Peminatan::create($request->validated());
        $peminatan->load('prodi');

        return new PeminatanResource($peminatan);
    }

    /**
     * Display the specified resource.
     */
    public function show(Peminatan $peminatan)
    {
        $peminatan->load('prodi');

        return new PeminatanResource($peminatan);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeminatanRequest $request, Peminatan $peminatan)
    {
        $peminatan->update($request->validated());
        $peminatan->load('prodi');

        return new PeminatanResource($peminatan);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Peminatan $peminatan)
    {
        $peminatan->delete();

        return response()->json([
            'message' => 'Peminatan berhasil dihapus'
        ]);
    }
}
