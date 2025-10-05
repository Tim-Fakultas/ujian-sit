<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJudulRequest;
use App\Http\Requests\UpdateJudulRequest;
use App\Http\Resources\JudulResource;
use App\Models\Judul;

class JudulController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $judul = Judul::with(['ranpel'])->get();

        return JudulResource::collection($judul);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJudulRequest $request)
    {
        $request->validated();
        $judul = Judul::create($request->all());

        return new JudulResource($judul);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $judul = Judul::with(['ranpel'])->findOrFail($id);

        return new JudulResource($judul);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJudulRequest $request, Judul $judul)
    {
        $request->validated();
        $judul->update($request->all());

        return new JudulResource($judul);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Judul $judul)
    {
        $judul->delete();

        return response()->json(['message' => 'Judul berhasil dihapus.'], 200);
    }
}
