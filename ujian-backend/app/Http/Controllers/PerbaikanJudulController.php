<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePerbaikanJudulRequest;
use App\Http\Requests\UpdatePerbaikanJudulRequest;
use App\Http\Resources\PerbaikanJudulResource;
use App\Models\PerbaikanJudul;
use App\Models\Ranpel;
use DB;
use Exception;

class PerbaikanJudulController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perbaikan = PerbaikanJudul::with(['mahasiswa', 'ranpel'])->get();
        return PerbaikanJudulResource::collection($perbaikan);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePerbaikanJudulRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $data = $request->validated();

                $ranpelId = $data['ranpel_id'];
                $mahasiswaId = $data['mahasiswa_id'];

                $ranpel = Ranpel::findOrFail($ranpelId);

                $terakhirDiterima = PerbaikanJudul::query()
                    ->where('ranpel_id', $ranpelId)
                    ->where('mahasiswa_id', $mahasiswaId)
                    ->where('status', 'diterima')
                    ->orderByDesc('tanggal_perbaikan')
                    ->orderByDesc('id')
                    ->first();

                $judul_lama = $terakhirDiterima?->judul_baru ?? $ranpel->judul_penelitian;

                $path = null;
                if ($request->hasFile('berkas')) {
                    $path = $request->file('berkas')->store('uploads/perbaikan_judul', 'public');
                }

                $perbaikan = PerbaikanJudul::create([
                    'ranpel_id' => $ranpel->id,
                    'mahasiswa_id' => $mahasiswaId,
                    'judul_lama' => $judul_lama,
                    'judul_baru' => $data['judul_baru'],
                    'berkas' => $path,
                    'status' => 'menunggu',
                    'tanggal_perbaikan' => now()
                ]);
                return new PerbaikanJudulResource(
                    $perbaikan->load(['mahasiswa', 'ranpel'])
                );
            });
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan perbaikan judul.',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(PerbaikanJudul $perbaikanJudul)
    {
        return new PerbaikanJudulResource($perbaikanJudul->load(['mahasiswa', 'ranpel']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePerbaikanJudulRequest $request, PerbaikanJudul $perbaikanJudul)
    {
        try {
            return DB::transaction(function () use ($request, $perbaikanJudul) {
                $data = $request->validated();

                if ($request->hasFile('berkas')) {
                    $path = $request->file('berkas')->store('uploads/perbaikan_judul', 'public');
                    $data['berkas'] = $path;
                }

                if (isset($data['status']) && $data['status'] === 'diterima') {
                    if (empty($perbaikanJudul->tanggal_diterima)) {
                        $data['tanggal_diterima'] = now();
                    }

                    // Update judul asli di tabel Ranpel agar sinkron
                    $judulBaru = $data['judul_baru'] ?? $perbaikanJudul->judul_baru;
                    if ($judulBaru) {
                        $perbaikanJudul->ranpel()->update([
                            'judul_penelitian' => $judulBaru
                        ]);
                    }
                }
                $perbaikanJudul->update($data);

                return new PerbaikanJudulResource(
                    $perbaikanJudul->fresh()->load(['mahasiswa', 'ranpel'])
                );

            });
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui perbaikan judul.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PerbaikanJudul $perbaikanJudul)
    {
        $perbaikanJudul->delete();

        return response()->json([
            'message' => 'Perbaikan judul deleted successfully',
        ]);
    }

    public function getByMahasiswa($mahasiswaId)
    {
        $perbaikan = PerbaikanJudul::with(['mahasiswa', 'ranpel'])
            ->where('mahasiswa_id', $mahasiswaId)
            ->orderByDesc('created_at')
            ->get();
        return PerbaikanJudulResource::collection($perbaikan);
    }

    public function getByPembimbing($dosenId)
    {
        $perbaikan = PerbaikanJudul::whereHas('mahasiswa', function ($query) use ($dosenId) {
            $query->where('pembimbing_1', $dosenId)
                ->orWhere('pembimbing_2', $dosenId);
        })
            ->with(['mahasiswa', 'ranpel'])
            ->orderByDesc('created_at')
            ->get();

        return PerbaikanJudulResource::collection($perbaikan);
    }

    public function getByDosenPa($dosenId)
    {
        $perbaikan = PerbaikanJudul::whereHas('mahasiswa', function ($query) use ($dosenId) {
            $query->where('dosen_pa', $dosenId)
                ->orWhere('pembimbing_1', $dosenId)
                ->orWhere('pembimbing_2', $dosenId);
        })
            ->with([
                'mahasiswa.prodi',
                'mahasiswa.peminatan',
                'mahasiswa.dosenPembimbingAkademik',
                'mahasiswa.pembimbing1',
                'mahasiswa.pembimbing2',
                'ranpel'
            ])
            ->orderByDesc('created_at')
            ->get();

        return PerbaikanJudulResource::collection($perbaikan);
    }
}
