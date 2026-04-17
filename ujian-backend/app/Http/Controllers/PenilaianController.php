<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePenilaianRequest;
use App\Http\Requests\UpdatePenilaianRequest;
use App\Http\Resources\PenilaianResource;
use App\Models\Penilaian;
use App\Models\Ujian;

/**
 * PenilaianController — Mengelola penilaian ujian.
 *
 * Mendukung single insert/update maupun batch insert/update.
 * Setiap perubahan penilaian akan otomatis menghitung ulang
 * nilai akhir ujian terkait via method `hitungNilaiAkhir()`.
 */
class PenilaianController extends Controller
{
    /**
     * Tampilkan daftar semua penilaian.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $penilaian = Penilaian::with(['ujian', 'dosen', 'komponenPenilaian'])->get();

        return PenilaianResource::collection($penilaian);
    }

    /**
     * Simpan penilaian — mendukung single dan batch insert.
     *
     * Batch insert: kirim array `data` berisi multiple penilaian.
     * Single insert: kirim field penilaian langsung di root body.
     *
     * Setiap simpan akan trigger perhitungan ulang nilai akhir ujian.
     *
     * @param  StorePenilaianRequest  $request
     * @return PenilaianResource|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function store(StorePenilaianRequest $request)
    {
        // Batch insert
        if ($request->has('data') && is_array($request->data)) {
            $validated = $request->validated();

            foreach ($validated['data'] as $item) {
                Penilaian::create($item);
            }

            // Hitung ulang nilai akhir untuk semua ujian yang terlibat
            $ujianIds = collect($validated['data'])->pluck('ujian_id')->unique();
            foreach ($ujianIds as $ujianId) {
                $ujian = Ujian::find($ujianId);
                $ujian?->hitungNilaiAkhir();
            }

            $latestRecords = Penilaian::with(['ujian', 'dosen', 'komponenPenilaian'])
                ->latest('id')
                ->take(count($validated['data']))
                ->get()
                ->reverse()
                ->values();

            return PenilaianResource::collection($latestRecords);
        }

        // Single insert
        $penilaian = Penilaian::create($request->validated());

        if ($penilaian->ujian) {
            $penilaian->ujian->hitungNilaiAkhir();
        }

        return new PenilaianResource($penilaian);
    }

    /**
     * Tampilkan detail satu penilaian.
     *
     * @param  int  $id
     * @return PenilaianResource
     */
    public function show($id)
    {
        $penilaian = Penilaian::with(['ujian', 'dosen', 'komponenPenilaian'])->findOrFail($id);

        return new PenilaianResource($penilaian);
    }

    /**
     * Update penilaian — mendukung single dan batch update.
     *
     * Batch update: kirim array `data` berisi penilaian dengan `id` dan nilai baru.
     * Single update: update langsung via route model binding.
     *
     * @param  UpdatePenilaianRequest  $request
     * @param  Penilaian  $penilaian
     * @return PenilaianResource|\Illuminate\Http\JsonResponse
     */
    public function update(UpdatePenilaianRequest $request, Penilaian $penilaian)
    {
        // Batch update
        if ($request->has('data') && is_array($request->data)) {
            $validated = $request->validated();
            $ujianIds = [];

            foreach ($validated['data'] as $item) {
                $record = Penilaian::find($item['id']);
                if ($record) {
                    $record->update([
                        'nilai'    => $item['nilai'],
                        'komentar' => $item['komentar'] ?? null,
                    ]);
                    $ujianIds[] = $record->ujian_id;
                }
            }

            // Hitung ulang nilai akhir ujian terkait
            foreach (array_unique($ujianIds) as $ujianId) {
                $ujian = Ujian::find($ujianId);
                $ujian?->hitungNilaiAkhir();
            }

            $updatedRecords = Penilaian::with(['ujian', 'dosen', 'komponenPenilaian'])
                ->whereIn('id', array_column($validated['data'], 'id'))
                ->get();

            return response()->json([
                'message' => 'Batch update berhasil',
                'data'    => PenilaianResource::collection($updatedRecords),
            ], 200);
        }

        // Single update
        $penilaian->update($request->validated());

        if ($penilaian->ujian) {
            $penilaian->ujian->hitungNilaiAkhir();
        }

        return new PenilaianResource($penilaian->fresh(['ujian', 'dosen', 'komponenPenilaian']));
    }

    /**
     * Hapus penilaian dan hitung ulang nilai akhir ujian terkait.
     *
     * @param  Penilaian  $penilaian
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Penilaian $penilaian)
    {
        $ujianId = $penilaian->ujian_id;

        $penilaian->delete();

        // Hitung ulang setelah penghapusan
        $ujian = Ujian::find($ujianId);
        $ujian?->hitungNilaiAkhir();

        return response()->json(['message' => 'Penilaian berhasil dihapus.'], 200);
    }
}
