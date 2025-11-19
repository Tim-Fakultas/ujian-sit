<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJadwalPengujiRequest;
use App\Http\Requests\UpdateJadwalPengujiRequest;
use App\Http\Resources\JadwalPengujiResource;
use App\Models\JadwalPenguji;

class JadwalPengujiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJadwalPengujiRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJadwalPengujiRequest $request, JadwalPenguji $jadwalPenguji)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JadwalPenguji $jadwalPenguji)
    {
    }
}
