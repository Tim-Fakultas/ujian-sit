<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUjianRequest;
use App\Http\Requests\UpdateUjianRequest;
use App\Http\Resources\UjianResource;
use App\Models\Ujian;

class UjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ujian = Ujian::with(['pendaftaran_ujian.ranpel', 'jenis_ujian', 'mahasiswa', 'penilaian'])->get();

        return UjianResource::collection($ujian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUjianRequest $request)
    {
        $request->validated();
        $ujian = Ujian::create($request->all());

        return new UjianResource($ujian);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ujian = Ujian::with(['pendaftaran_ujian.ranpel', 'jenis_ujian', 'mahasiswa', 'penilaian'])->findOrFail($id);

        return new UjianResource($ujian);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUjianRequest $request, Ujian $ujian)
    {
        // Ambil hanya field yang dikirim (bukan semua yang lolos validasi)
        $data = array_filter(
            $request->only([
                'jadwal_ujian',
                'waktu_mulai',
                'waktu_selesai',
                'ruangan',
                'ketua_penguji',
                'sekretaris_penguji',
                'penguji_1',
                'penguji_2',
                'hasil',
                'nilai_akhir',
                'catatan',
            ]),
            fn($value) => !is_null($value)
        );

        // Update hanya field yang dikirim
        $ujian->update($data);

        // Auto-set hasil kalau nilai_akhir dikirim tanpa hasil
        if (isset($data['nilai_akhir']) && !isset($data['hasil'])) {
            $ujian->hasil = $data['nilai_akhir'] >= 70 ? 'lulus' : 'tidak lulus';
            $ujian->save();
        }

        return new UjianResource(
            $ujian->load(['pendaftaran_ujian.ranpel', 'jenis_ujian', 'mahasiswa'])
        );
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ujian $ujian)
    {
        $ujian->delete();

        return response()->json(['message' => 'Ujian berhasil dihapus.'], 200);
    }
}
