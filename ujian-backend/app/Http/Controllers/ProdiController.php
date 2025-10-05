<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProdiRequest;
use App\Http\Requests\UpdateProdiRequest;
use App\Http\Resources\ProdiResource;
use App\Models\Prodi;

class ProdiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $prodi = Prodi::with('fakultas')->get();

        return ProdiResource::collection($prodi);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProdiRequest $request)
    {
        $request->validated();
        $prodi = Prodi::create($request->all());

        return new ProdiResource($prodi);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $prodi = Prodi::findOrFail($id);

        return new ProdiResource($prodi);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProdiRequest $request, Prodi $prodi)
    {
        $request->validated();
        $prodi->update($request->all());

        return new ProdiResource($prodi);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Prodi $prodi)
    {
        $prodi->delete();

        return response()->json(['message' => 'Prodi berhasil dihapus.'], 200);
    }
}
