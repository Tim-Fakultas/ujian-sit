<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFakultasRequest;
use App\Http\Requests\UpdateFakultasRequest;
use App\Http\Resources\FakultasResource;
use App\Models\Fakultas;

class FakultasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fakultas = Fakultas::all();

        return FakultasResource::collection($fakultas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFakultasRequest $request)
    {
        $request->validated();
        $fakultas = Fakultas::create($request->all());

        return new FakultasResource($fakultas);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $fakultas = Fakultas::findOrFail($id);

        return new FakultasResource($fakultas);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFakultasRequest $request, Fakultas $fakultas)
    {
        $verif = $request->validated();
        $fakultas->update($verif);
        $fakultas->refresh();

        return new FakultasResource($fakultas);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fakultas $fakultas)
    {
        $fakultas->delete();

        return response()->json(['message' => 'Fakultas berhasil dihapus.'], 200);
    }
}
