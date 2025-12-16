<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePerbaikanJudulRequest;
use App\Http\Requests\UpdatePerbaikanJudulRequest;
use App\Http\Resources\PerbaikanJudulResource;
use App\Models\PerbaikanJudul;

class PerbaikanJudulController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perbaikan = PerbaikanJudul::with(['mahasiswa', 'ranpel'])->get();
        return PerbaikanJudulResource::collection($perbaikan);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePerbaikanJudulRequest $request)
    {
        $validated = $request->validated();

        $perbaikan = PerbaikanJudul::create($validated);

        return new PerbaikanJudulResource($perbaikan);
    }

    /**
     * Display the specified resource.
     */
    public function show(PerbaikanJudul $perbaikanJudul)
    {
        return new PerbaikanJudulResource($perbaikanJudul);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePerbaikanJudulRequest $request, PerbaikanJudul $perbaikanJudul)
    {
        $validated = $request->validated();

        $perbaikanJudul->update($validated);

        return new PerbaikanJudulResource($perbaikanJudul);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PerbaikanJudul $perbaikanJudul)
    {
        $perbaikanJudul->delete();

        return response()->json([
            'message' => 'Perbaikan judul deleted successfully',
        ]);
    }
}
