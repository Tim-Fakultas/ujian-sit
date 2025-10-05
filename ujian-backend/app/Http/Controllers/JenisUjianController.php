<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJenisUjianRequest;
use App\Http\Requests\UpdateJenisUjianRequest;
use App\Http\Resources\JenisUjianResource;
use App\Models\JenisUjian;

class JenisUjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jenisUjian = JenisUjian::all();

        return JenisUjianResource::collection($jenisUjian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJenisUjianRequest $request)
    {
        $request->validated();
        $jenisUjian = JenisUjian::create($request->all());

        return new JenisUjianResource($jenisUjian);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $jenisUjian = JenisUjian::findOrFail($id);

        return new JenisUjianResource($jenisUjian);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJenisUjianRequest $request, JenisUjian $jenisUjian)
    {
        $request->validated();
        $jenisUjian->update($request->all());

        return new JenisUjianResource($jenisUjian);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JenisUjian $jenisUjian)
    {
        $jenisUjian->delete();

        return response()->json(['message' => 'Jenis ujian berhasil dihapus.'], 200);
    }
}
