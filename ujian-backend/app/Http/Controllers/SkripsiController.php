<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSkripsiRequest;
use App\Http\Requests\UpdateSkripsiRequest;
use App\Http\Resources\SkripsiResource;
use App\Models\Skripsi;

class SkripsiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $skripsi = Skripsi::all();
        return SkripsiResource::collection($skripsi);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSkripsiRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Skripsi $skripsi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSkripsiRequest $request, Skripsi $skripsi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skripsi $skripsi)
    {
        //
    }
}
