<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePendaftaranUjianRequest;
use App\Http\Requests\UpdatePendaftaranUjianRequest;
use App\Http\Resources\PendaftaranUjianResource;
use App\Models\PendaftaranUjian;
use DB;

class PendaftaranUjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pendaftaranUjian = PendaftaranUjian::with(['mahasiswa', 'jenis_ujian', 'ranpel', 'berkas'])->get();

        return PendaftaranUjianResource::collection($pendaftaranUjian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePendaftaranUjianRequest $request)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validated();

            // 1️⃣ Buat pendaftaran ujian baru
            $pendaftaran = PendaftaranUjian::create([
                'mahasiswa_id' => $validated['mahasiswaId'],
                'ranpel_id' => $validated['ranpelId'],
                'jenis_ujian_id' => $validated['jenisUjianId'],
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => $validated['keterangan'] ?? null,
            ]);

            // 2️⃣ Upload semua berkas (jika ada)
            if ($request->hasFile('berkas')) {
                foreach ($request->file('berkas') as $file) {
                    $path = $file->store('uploads/berkas_ujian', 'public');
                    $pendaftaran->berkas()->create([
                        'nama_berkas' => $file->getClientOriginalName(),
                        'file_path' => $path,
                    ]);
                }
            }

            DB::commit();

            return new PendaftaranUjianResource(
                $pendaftaran->load(['mahasiswa', 'ranpel', 'jenis_ujian', 'berkas'])
            );
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal menyimpan pendaftaran ujian.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pendaftaranUjian = PendaftaranUjian::with(['mahasiswa', 'jenis_ujian', 'skripsi'])->findOrFail($id);

        return new PendaftaranUjianResource($pendaftaranUjian);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePendaftaranUjianRequest $request, PendaftaranUjian $pendaftaranUjian)
    {
        $validated = $request->validated();

        $pendaftaranUjian->update($validated);

        // Jika admin ingin menambah berkas tambahan
        if ($request->hasFile('berkas')) {
            foreach ($request->file('berkas') as $file) {
                $path = $file->store('uploads/berkas_ujian', 'public');
                $pendaftaranUjian->berkas()->create([
                    'nama_berkas' => $file->getClientOriginalName(),
                    'file_path' => $path,
                ]);
            }
        }

        return new PendaftaranUjianResource(
            $pendaftaranUjian->load(['mahasiswa', 'ranpel', 'jenisUjian', 'berkas'])
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PendaftaranUjian $pendaftaranUjian)
    {
        $pendaftaranUjian->delete();

        return response()->json(['message' => 'Pendaftaran ujian berhasil dihapus.'], 200);
    }
}
