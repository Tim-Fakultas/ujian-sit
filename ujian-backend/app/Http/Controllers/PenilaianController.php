<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePenilaianRequest;
use App\Http\Requests\UpdatePenilaianRequest;
use App\Http\Resources\PenilaianResource;
use App\Models\Penilaian;
use App\Models\Ujian;

class PenilaianController extends Controller
{
    public function index()
    {
        $penilaian = Penilaian::with(['ujian', 'dosen', 'komponenPenilaian'])->get();
        return PenilaianResource::collection($penilaian);
    }

    public function store(StorePenilaianRequest $request)
    {
        // ✅ BATCH INSERT
        if ($request->has('data') && is_array($request->data)) {
            $validated = $request->validated();

            // Simpan pakai loop create() supaya event model tetap jalan
            foreach ($validated['data'] as $item) {
                // Data sudah dikonversi ke snake_case oleh StorePenilaianRequest
                Penilaian::create($item);
            }

            // 🔹 Hitung ulang nilai akhir untuk semua ujian yang terlibat
            $ujianIds = collect($validated['data'])->pluck('ujian_id')->unique();
            foreach ($ujianIds as $ujianId) {
                $ujian = Ujian::find($ujianId);
                if ($ujian) {
                    $ujian->hitungNilaiAkhir();
                }
            }

            // Kembalikan data hasil input
            $latestRecords = Penilaian::with(['ujian', 'dosen', 'komponenPenilaian'])
                ->latest('id')
                ->take(count($validated['data']))
                ->get()
                ->reverse()
                ->values();

            return PenilaianResource::collection($latestRecords);
        }

        // ✅ SINGLE INSERT
        $validated = $request->validated();
        \Log::info('Validated data in controller:', $validated);
        $penilaian = Penilaian::create($validated);

        // 🔹 Hitung ulang nilai akhir ujian tunggal
        if ($penilaian->ujian) {
            $penilaian->ujian->hitungNilaiAkhir();
        }

        return new PenilaianResource($penilaian);
    }

    public function show($id)
    {
        $penilaian = Penilaian::with(['ujian', 'dosen', 'komponenPenilaian'])->findOrFail($id);
        return new PenilaianResource($penilaian);
    }

    public function update(UpdatePenilaianRequest $request, Penilaian $penilaian)
    {
        // ✅ BATCH UPDATE
        if ($request->has('data') && is_array($request->data)) {
            $validated = $request->validated();

            // Kumpulkan ujian_id yang perlu dihitung ulang
            $ujianIds = [];

            foreach ($validated['data'] as $item) {
                $record = Penilaian::find($item['id']);
                if ($record) {
                    $record->update([
                        'nilai' => $item['nilai'],
                        'komentar' => $item['komentar'] ?? null,
                    ]);

                    // Simpan ujian_id-nya untuk dihitung nanti
                    $ujianIds[] = $record->ujian_id;
                }
            }

            // 🔹 Hitung ulang nilai akhir untuk semua ujian terkait
            foreach (array_unique($ujianIds) as $ujianId) {
                $ujian = Ujian::find($ujianId);
                if ($ujian) {
                    $ujian->hitungNilaiAkhir();
                }
            }

            $updatedRecords = Penilaian::with(['ujian', 'dosen', 'komponenPenilaian'])
                ->whereIn('id', array_column($validated['data'], 'id'))
                ->get();

            return response()->json([
                'message' => 'Batch update berhasil',
                'data' => PenilaianResource::collection($updatedRecords),
            ], 200);
        }

        // ✅ SINGLE UPDATE
        $penilaian->update($request->validated());

        // 🔹 Hitung ulang nilai akhir ujian tunggal
        if ($penilaian->ujian) {
            $penilaian->ujian->hitungNilaiAkhir();
        }

        return new PenilaianResource($penilaian->fresh(['ujian', 'dosen', 'komponenPenilaian']));
    }

    public function destroy(Penilaian $penilaian)
    {
        $ujianId = $penilaian->ujian_id;

        $penilaian->delete();

        // 🔹 Recalculate after delete
        $ujian = Ujian::find($ujianId);
        if ($ujian) {
            $ujian->hitungNilaiAkhir();
        }

        return response()->json(['message' => 'Penilaian berhasil dihapus.'], 200);
    }
}
