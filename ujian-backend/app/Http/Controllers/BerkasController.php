<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBerkasRequest;
use App\Http\Requests\UpdateBerkasRequest;
use App\Http\Resources\BerkasResource;
use App\Models\Berkas;

class BerkasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $berkas = Berkas::all();
        return BerkasResource::collection($berkas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBerkasRequest $request)
    {
        $request->validated();
        $berkas = Berkas::create($request->all());

        return new BerkasResource($berkas);
    }

    /**
     * Display the specified resource.
     */
    public function show(Berkas $berkas)
    {
        return new BerkasResource($berkas);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBerkasRequest $request, Berkas $berkas)
    {
        $validated = $request->validated();
        $berkas->update($validated);
        return new BerkasResource($berkas);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Berkas $berkas)
    {
        $berkas->delete();
        return response()->json(['message' => 'Berkas deleted successfully.'], 200);
    }
}
