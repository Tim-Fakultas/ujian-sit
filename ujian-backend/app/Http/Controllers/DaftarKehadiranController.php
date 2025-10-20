<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDaftarKehadiranRequest;
use App\Http\Requests\UpdateDaftarKehadiranRequest;
use App\Http\Resources\DaftarKehadiranResource;
use App\Models\DaftarKehadiran;

class DaftarKehadiranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $daftarKehadiran = DaftarKehadiran::with(['ujian', 'dosen'])->get();
        return DaftarKehadiranResource::collection($daftarKehadiran);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDaftarKehadiranRequest $request)
    {
        $request->validated();
        $daftarKehadiran = DaftarKehadiran::create($request->all());
        return new DaftarKehadiranResource($daftarKehadiran);
    }

    /**
     * Display the specified resource.
     */
    public function show(DaftarKehadiran $daftarKehadiran)
    {
        return new DaftarKehadiranResource($daftarKehadiran);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDaftarKehadiranRequest $request, DaftarKehadiran $daftarKehadiran)
    {
        $request->validated();
        $daftarKehadiran->update($request->all());
        return new DaftarKehadiranResource($daftarKehadiran);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DaftarKehadiran $daftarKehadiran)
    {
        $daftarKehadiran->delete();
        return response()->json(['message' => 'Daftar kehadiran deleted successfully.'], 200);
    }
}
