<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDosenRequest;
use App\Http\Requests\UpdateDosenRequest;
use App\Http\Resources\DosenResource;
use App\Models\Dosen;

class DosenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $dosen = Dosen::with('prodi')->get();
        return DosenResource::collection($dosen);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDosenRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Dosen $dosen)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDosenRequest $request, Dosen $dosen)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dosen $dosen)
    {
        //
    }
}
