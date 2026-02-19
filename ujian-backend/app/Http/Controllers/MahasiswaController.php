<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMahasiswaRequest;
use App\Http\Requests\UpdateMahasiswaRequest;
use App\Http\Resources\MahasiswaResource;
use App\Models\Mahasiswa;
use Illuminate\Support\Facades\Cache;
use Log;

class MahasiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(\Illuminate\Http\Request $request)
    {
        if ($request->has('user_id')) {
            $userId = $request->query('user_id');
            $mahasiswa = Mahasiswa::with(['prodi', 'peminatan', 'dosenPembimbingAkademik', 'pembimbing1', 'pembimbing2'])->where('user_id', $userId)->get();
            return MahasiswaResource::collection($mahasiswa);
        }

        $mahasiswa = Cache::remember('mahasiswa_all', 600, function () {
            return Mahasiswa::with(['prodi', 'peminatan', 'dosenPembimbingAkademik', 'pembimbing1', 'pembimbing2'])->get();
        });

        return MahasiswaResource::collection($mahasiswa);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMahasiswaRequest $request)
    {
        $request->validated();
        $mahasiswa = Mahasiswa::create($request->all());

        Cache::forget('mahasiswa_all');

        return new MahasiswaResource($mahasiswa);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $mahasiswa = Cache::remember("mahasiswa_{$id}", 600, function () use ($id) {
            return Mahasiswa::with(['prodi', 'peminatan', 'dosenPembimbingAkademik', 'pembimbing1', 'pembimbing2'])->findOrFail($id);
        });

        return new MahasiswaResource($mahasiswa);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa)
    {
        $validated = $request->validated();

        if ($request->hasFile('file_ktm')) {
            $file = $request->file('file_ktm');
            // Simpan di storage/app/public/ktm
            $path = $file->store('public/ktm');
            // Generate URL yang bisa diakses publik (pastikan run php artisan storage:link)
            // Gunakan url() agar sesuai dengan host:port yang sedang berjalan (misal localhost:8000)
            $url = url('storage/' . str_replace('public/', '', $path));

            $mahasiswa->url_ktm = $url;
            $mahasiswa->save();
        }

        // Ambil hanya versi snake_case
        $merged = array_filter($request->only([
            'no_hp',
            'prodi_id',
            'peminatan_id',
            'dosen_pa',
            'pembimbing_1',
            'pembimbing_2',
            'user_id',
            'ipk',
            'semester',
        ]), fn($v) => !is_null($v));

        Log::info('DEBUG UPDATE MAHASISWA', [
            'validated' => $validated,
            'merged' => $merged,
        ]);

        $mahasiswa->update($merged);
        $mahasiswa->load(['prodi', 'peminatan', 'dosenPembimbingAkademik']);

        Cache::forget('mahasiswa_all');
        Cache::forget("mahasiswa_{$mahasiswa->id}");

        return new MahasiswaResource($mahasiswa);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mahasiswa $mahasiswa)
    {
        $mahasiswa->delete();

        Cache::forget('mahasiswa_all');

        return response()->json(['message' => 'Mahasiswa berhasil dihapus.'], 200);
    }
}
