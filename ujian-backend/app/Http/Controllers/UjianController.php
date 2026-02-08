<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUjianRequest;
use App\Http\Requests\UpdateUjianRequest;
use App\Http\Resources\UjianResource;
use App\Models\Ujian;
use App\Models\Dosen;

class UjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ujian = Ujian::with([
            'pendaftaranUjian.ranpel',
            'jenisUjian',
            'mahasiswa',
            'penilaian',
            'ruangan',
            'dosenPenguji',
            'keputusan',
        ])
        ->get();

        return UjianResource::collection($ujian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUjianRequest $request)
    {
        $request->validated();
        $ujian = Ujian::create($request->all());

        if ($request->has('penguji')) {
            $pengujiRequest = $request->penguji;
            $syncData = collect($pengujiRequest)
                ->mapWithKeys(fn($penguji) => [
                    $penguji['dosen_id'] => ['peran' => $penguji['peran']]
                ])->toArray();

            $ujian->dosenPenguji()->sync($syncData);


        }

        return new UjianResource($ujian);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ujian = Ujian::with([
            'pendaftaranUjian.ranpel',
            'jenisUjian',
            'mahasiswa',
            'penilaian',
            'ruangan',
            'dosenPenguji'
        ])
        ->findOrFail($id);

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
                'hari_ujian',
                'jadwal_ujian',
                'waktu_mulai',
                'waktu_selesai',
                'ruangan_id',
                'hasil',
                'keputusan_id',
                'nilai_akhir',
                'catatan',
            ]),
            fn($value) => !is_null($value)
        );

        // Update hanya field yang dikirim
        $ujian->update($data);

        if ($request->has('penguji')) {
            $pengujiRequest = $request->penguji;
            // Sync penguji
            $syncData = [];
            foreach ($pengujiRequest as $item) {
                $syncData[$item['dosen_id']] = ['peran' => $item['peran']];
            }
            $ujian->dosenPenguji()->sync($syncData);

            $ujian->hitungNilaiAkhir();
        }

        return new UjianResource(
            $ujian->load(['pendaftaranUjian.ranpel', 'jenisUjian', 'mahasiswa', 'ruangan', 'penilaian', 'dosenPenguji'])
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

    public function getByMahasiswa($id)
    {
        $namaJenis = request()->input('nama_jenis');

        $ujian = Ujian::query()
            ->with([
            'pendaftaranUjian.ranpel',
            'jenisUjian',
            'mahasiswa',
            'penilaian',
            'ruangan',
            'dosenPenguji',
            'keputusan',
            ])
            ->where('mahasiswa_id', $id)
            ->when($namaJenis, function ($q) use ($namaJenis) {
                $q->whereHas('jenisUjian', function ($query) use ($namaJenis) {
                    $query->where('nama_jenis', 'like', '%' . $namaJenis . '%');
                });
            })
            ->orderBy('id', 'desc')
            ->get();

        return UjianResource::collection($ujian);
    }
}
