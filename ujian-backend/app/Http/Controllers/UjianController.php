<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUjianRequest;
use App\Http\Requests\UpdateUjianRequest;
use App\Http\Resources\UjianResource;
use App\Models\Ujian;

/**
 * UjianController — Mengelola data ujian.
 *
 * Menyediakan CRUD untuk entity Ujian (Seminar Proposal, Ujian Hasil,
 * Ujian Skripsi). Termasuk pengelolaan dosen penguji, penjadwalan,
 * dan penentuan hasil/kelulusan.
 */
class UjianController extends Controller
{
    /**
     * Tampilkan daftar semua ujian beserta relasi terkait.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
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
        ])->get();

        return UjianResource::collection($ujian);
    }

    /**
     * Simpan data ujian baru.
     *
     * Jika request mengandung array `penguji`, data dosen penguji
     * akan disinkronkan ke pivot table `penguji_ujian`.
     *
     * @param  StoreUjianRequest  $request
     * @return UjianResource
     */
    public function store(StoreUjianRequest $request)
    {
        $ujian = Ujian::create($request->validated());

        // Sync dosen penguji jika ada
        if ($request->has('penguji')) {
            $syncData = collect($request->penguji)
                ->mapWithKeys(fn($penguji) => [
                    $penguji['dosen_id'] => ['peran' => $penguji['peran']],
                ])->toArray();

            $ujian->dosenPenguji()->sync($syncData);
        }

        return new UjianResource($ujian);
    }

    /**
     * Tampilkan detail satu ujian beserta seluruh relasi.
     *
     * @param  int  $id
     * @return UjianResource
     */
    public function show($id)
    {
        $ujian = Ujian::with([
            'pendaftaranUjian.ranpel',
            'jenisUjian',
            'mahasiswa',
            'penilaian',
            'ruangan',
            'dosenPenguji',
        ])->findOrFail($id);

        return new UjianResource($ujian);
    }

    /**
     * Update data ujian.
     *
     * Hanya field yang dikirim yang akan diperbarui (partial update).
     * Jika `nilai_akhir` diset tanpa `hasil`, maka hasil otomatis
     * dihitung: >= 70 = "lulus", < 70 = "tidak lulus".
     *
     * @param  UpdateUjianRequest  $request
     * @param  Ujian  $ujian
     * @return UjianResource
     */
    public function update(UpdateUjianRequest $request, Ujian $ujian)
    {
        // Ambil hanya field yang dikirim (bukan null)
        $data = array_filter(
            $request->only([
                'hari_ujian', 'jadwal_ujian', 'waktu_mulai', 'waktu_selesai',
                'ruangan_id', 'hasil', 'keputusan_id', 'nilai_akhir', 'catatan',
            ]),
            fn($value) => !is_null($value)
        );

        $ujian->update($data);

        // Auto-set hasil berdasarkan nilai_akhir jika hasil tidak dikirim
        if (isset($data['nilai_akhir']) && !isset($data['hasil'])) {
            $ujian->update([
                'hasil' => $data['nilai_akhir'] >= 70 ? 'lulus' : 'tidak lulus',
            ]);
        }

        // Sync dosen penguji jika ada
        if ($request->has('penguji')) {
            $syncData = [];
            foreach ($request->penguji as $item) {
                $syncData[$item['dosen_id']] = ['peran' => $item['peran']];
            }
            $ujian->dosenPenguji()->sync($syncData);
        }

        return new UjianResource(
            $ujian->load([
                'pendaftaranUjian.ranpel', 'jenisUjian', 'mahasiswa',
                'ruangan', 'penilaian', 'dosenPenguji',
            ])
        );
    }

    /**
     * Hapus data ujian.
     *
     * @param  Ujian  $ujian
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Ujian $ujian)
    {
        $ujian->delete();

        return response()->json(['message' => 'Ujian berhasil dihapus.'], 200);
    }

    /**
     * Tampilkan daftar ujian milik mahasiswa tertentu.
     *
     * Mendukung filter berdasarkan `nama_jenis` (jenis ujian) via query parameter.
     *
     * @param  int  $id  ID Mahasiswa
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getByMahasiswa($id)
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
            ->where('mahasiswa_id', $id)
            ->when(request('nama_jenis'), function ($q) {
                $q->whereHas('jenisUjian', function ($query) {
                    $query->where('nama_jenis', 'like', '%' . request('nama_jenis') . '%');
                });
            })
            ->orderBy('id', 'desc')
            ->get();

        return UjianResource::collection($ujian);
    }
}
