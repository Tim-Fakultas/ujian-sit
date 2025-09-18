<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePejabatRequest;
use App\Http\Requests\UpdatePejabatRequest;
use App\Http\Resources\PejabatResource;
use App\Models\Pejabat;

class PejabatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pejabat = Pejabat::all();
        return PejabatResource::collection($pejabat);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePejabatRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Pejabat $pejabat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePejabatRequest $request, Pejabat $pejabat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pejabat $pejabat)
    {
        //
    }
}
