<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMahasiswaRequest;
use App\Http\Requests\UpdateMahasiswaRequest;
use App\Http\Resources\MahasiswaResource;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * MahasiswaController — Mengelola data mahasiswa.
 *
 * Menyediakan CRUD untuk entity Mahasiswa termasuk
 * relasi prodi, peminatan, dosen PA, dan pembimbing.
 * Menggunakan cache untuk optimasi query list dan detail.
 */
class MahasiswaController extends Controller
{
    /**
     * Tampilkan daftar semua mahasiswa.
     *
     * Mendukung filter berdasarkan `user_id` via query parameter.
     * Data di-cache selama 10 menit untuk performa.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        if ($request->has('user_id')) {
            $userId = $request->query('user_id');
            $mahasiswa = Mahasiswa::with([
                'prodi', 'peminatan', 'dosenPembimbingAkademik', 'pembimbing1', 'pembimbing2',
            ])->where('user_id', $userId)->get();

            return MahasiswaResource::collection($mahasiswa);
        }

        $mahasiswa = Cache::remember('mahasiswa_all', 600, function () {
            return Mahasiswa::with([
                'prodi', 'peminatan', 'dosenPembimbingAkademik', 'pembimbing1', 'pembimbing2',
            ])->get();
        });

        return MahasiswaResource::collection($mahasiswa);
    }

    /**
     * Simpan data mahasiswa baru.
     *
     * @param  StoreMahasiswaRequest  $request
     * @return MahasiswaResource
     */
    public function store(StoreMahasiswaRequest $request)
    {
        $mahasiswa = Mahasiswa::create($request->validated());

        Cache::forget('mahasiswa_all');

        return new MahasiswaResource($mahasiswa);
    }

    /**
     * Tampilkan detail satu mahasiswa berdasarkan ID.
     *
     * Data di-cache selama 10 menit per mahasiswa.
     *
     * @param  int  $id
     * @return MahasiswaResource
     */
    public function show($id)
    {
        $mahasiswa = Cache::remember("mahasiswa_{$id}", 600, function () use ($id) {
            return Mahasiswa::with([
                'prodi', 'peminatan', 'dosenPembimbingAkademik', 'pembimbing1', 'pembimbing2',
            ])->findOrFail($id);
        });

        return new MahasiswaResource($mahasiswa);
    }

    /**
     * Update data mahasiswa.
     *
     * Mendukung upload file KTM dan update field-field
     * termasuk dosen PA, pembimbing, dokumen pendukung, dll.
     *
     * @param  UpdateMahasiswaRequest  $request
     * @param  Mahasiswa  $mahasiswa
     * @return MahasiswaResource
     */
    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa)
    {
        // Upload file KTM jika ada
        if ($request->hasFile('file_ktm')) {
            $file = $request->file('file_ktm');
            $path = $file->store('public/ktm');
            $url = url('storage/' . str_replace('public/', '', $path));

            $mahasiswa->url_ktm = $url;
            $mahasiswa->save();
        }

        // Ambil hanya field yang dikirim (snake_case)
        $merged = array_filter($request->only([
            'no_hp', 'prodi_id', 'peminatan_id', 'dosen_pa',
            'pembimbing_1', 'pembimbing_2', 'user_id', 'ipk',
            'semester', 'url_ktm', 'url_transkrip_nilai',
            'url_bukti_lulus_metopen', 'url_sertifikat_bta',
        ]), fn($v) => !is_null($v));

        $mahasiswa->update($merged);
        $mahasiswa->load(['prodi', 'peminatan', 'dosenPembimbingAkademik']);

        Cache::forget('mahasiswa_all');
        Cache::forget("mahasiswa_{$mahasiswa->id}");

        return new MahasiswaResource($mahasiswa);
    }

    /**
     * Hapus data mahasiswa.
     *
     * @param  Mahasiswa  $mahasiswa
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Mahasiswa $mahasiswa)
    {
        $mahasiswa->delete();

        Cache::forget('mahasiswa_all');

        return response()->json(['message' => 'Mahasiswa berhasil dihapus.'], 200);
    }
}
