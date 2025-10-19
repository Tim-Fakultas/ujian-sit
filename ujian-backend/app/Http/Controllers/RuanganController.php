<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRuanganRequest;
use App\Http\Requests\UpdateRuanganRequest;
use App\Http\Resources\RuanganResource;
use App\Models\Ruangan;

class RuanganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ruangan = Ruangan::with('prodi')->get();
        return RuanganResource::collection($ruangan);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRuanganRequest $request)
    {
        $request->validated();
        $ruangan = $request->only([
            'prodi_id',
            'nama_ruangan',
        ]);
        $ruangan = Ruangan::create($ruangan);
        return new RuanganResource($ruangan);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ruangan $ruangan)
    {
        $ranpel = Ruangan::findOrFail($ruangan->id);
        return new RuanganResource($ranpel);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ruangan $ruangan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRuanganRequest $request, Ruangan $ruangan)
    {
        $validated = $request->validated();
        $ruangan_only = array_filter($request->only([
            'prodi_id',
            'nama_ruangan',
        ]));
        $ruangan->update($ruangan_only);

        return new RuanganResource($ruangan);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ruangan $ruangan)
    {
        $ruangan->delete();
        return response()->json(['message' => 'Ruangan berhasil dihapus.'], 200);
    }
}
