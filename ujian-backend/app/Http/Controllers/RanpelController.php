<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRanpelRequest;
use App\Http\Requests\UpdateRanpelRequest;
use App\Http\Resources\RanpelResource;
use App\Models\Ranpel;

class RanpelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ranpel = Ranpel::with(['skripsi', 'judul'])->get();

        return RanpelResource::collection($ranpel);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRanpelRequest $request)
    {
        $request->validated();
        $ranpel = Ranpel::create($request->all());

        return new RanpelResource($ranpel);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ranpel = Ranpel::with(['skripsi', 'judul'])->findOrFail($id);

        return new RanpelResource($ranpel);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRanpelRequest $request, Ranpel $ranpel)
    {
        $request->validated();
        $ranpel->update($request->all());

        return new RanpelResource($ranpel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ranpel $ranpel)
    {
        $ranpel->delete();

        return response()->json(['message' => 'Ranpel berhasil dihapus.'], 200);
    }
}
