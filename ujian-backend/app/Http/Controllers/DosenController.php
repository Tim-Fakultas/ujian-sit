<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDosenRequest;
use App\Http\Requests\UpdateDosenRequest;
use App\Http\Resources\DosenResource;
use App\Models\Dosen;
use Illuminate\Support\Facades\Cache;


class DosenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dosen = Cache::remember('dosen_all', 600, function () {
            return Dosen::with('prodi')->get();
        });

        return DosenResource::collection($dosen);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDosenRequest $request)
    {
        $request->validated();
        $dosen = Dosen::create($request->all());

        Cache::forget('dosen_all');

        return new DosenResource($dosen);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $dosen = Cache::remember("dosen_{$id}", 600, function () use ($id) {
            return Dosen::with('prodi')->findOrFail($id);
        });

        return new DosenResource($dosen);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDosenRequest $request, Dosen $dosen)
    {
        $request->validated();
        $dosen->update($request->all());

        Cache::forget('dosen_all');

        return new DosenResource($dosen);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dosen $dosen)
    {
        $dosen->delete();

        Cache::forget('dosen_all');

        return response()->json(['message' => 'Dosen berhasil dihapus.'], 200);
    }
}
