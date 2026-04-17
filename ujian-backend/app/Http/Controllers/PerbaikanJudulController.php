<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePerbaikanJudulRequest;
use App\Http\Requests\UpdatePerbaikanJudulRequest;
use App\Http\Resources\PerbaikanJudulResource;
use App\Models\PerbaikanJudul;
use App\Models\Ranpel;
use Exception;
use Illuminate\Support\Facades\DB;

/**
 * PerbaikanJudulController — Mengelola perbaikan judul penelitian.
 *
 * Mahasiswa dapat mengajukan perubahan judul dari judul yang sudah
 * diterima sebelumnya. Dosen PA/pembimbing dapat menyetujui atau menolak.
 * Jika diterima, judul di tabel ranpel otomatis di-update agar sinkron.
 */
class PerbaikanJudulController extends Controller
{
    /**
     * Tampilkan daftar semua perbaikan judul.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $perbaikan = PerbaikanJudul::with(['mahasiswa', 'ranpel'])->get();

        return PerbaikanJudulResource::collection($perbaikan);
    }

    /**
     * Simpan pengajuan perbaikan judul baru.
     *
     * Judul lama diambil otomatis dari perbaikan terakhir yang diterima,
     * atau dari judul awal di tabel ranpel jika belum ada perbaikan.
     * Mendukung upload berkas pendukung.
     *
     * @param  StorePerbaikanJudulRequest  $request
     * @return PerbaikanJudulResource|\Illuminate\Http\JsonResponse
     */
    public function store(StorePerbaikanJudulRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $data = $request->validated();
                $ranpel = Ranpel::findOrFail($data['ranpel_id']);

                // Cari judul lama: dari perbaikan terakhir yang diterima, atau judul asal
                $terakhirDiterima = PerbaikanJudul::query()
                    ->where('ranpel_id', $data['ranpel_id'])
                    ->where('mahasiswa_id', $data['mahasiswa_id'])
                    ->where('status', 'diterima')
                    ->orderByDesc('tanggal_perbaikan')
                    ->orderByDesc('id')
                    ->first();

                $judulLama = $terakhirDiterima?->judul_baru ?? $ranpel->judul_penelitian;

                // Upload berkas pendukung
                $path = null;
                if ($request->hasFile('berkas')) {
                    $path = $request->file('berkas')->store('uploads/perbaikan_judul', 'public');
                }

                $perbaikan = PerbaikanJudul::create([
                    'ranpel_id'         => $ranpel->id,
                    'mahasiswa_id'      => $data['mahasiswa_id'],
                    'judul_lama'        => $judulLama,
                    'judul_baru'        => $data['judul_baru'],
                    'berkas'            => $path,
                    'status'            => 'menunggu',
                    'tanggal_perbaikan' => now(),
                ]);

                return new PerbaikanJudulResource(
                    $perbaikan->load(['mahasiswa', 'ranpel'])
                );
            });
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan perbaikan judul.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tampilkan detail satu perbaikan judul.
     *
     * @param  PerbaikanJudul  $perbaikanJudul
     * @return PerbaikanJudulResource
     */
    public function show(PerbaikanJudul $perbaikanJudul)
    {
        return new PerbaikanJudulResource($perbaikanJudul->load(['mahasiswa', 'ranpel']));
    }

    /**
     * Update perbaikan judul.
     *
     * Saat status diubah ke "diterima":
     * - Otomatis set `tanggal_diterima`
     * - Sinkronkan judul baru ke tabel ranpel
     *
     * @param  UpdatePerbaikanJudulRequest  $request
     * @param  PerbaikanJudul  $perbaikanJudul
     * @return PerbaikanJudulResource|\Illuminate\Http\JsonResponse
     */
    public function update(UpdatePerbaikanJudulRequest $request, PerbaikanJudul $perbaikanJudul)
    {
        try {
            return DB::transaction(function () use ($request, $perbaikanJudul) {
                $data = $request->validated();

                // Upload berkas baru jika ada
                if ($request->hasFile('berkas')) {
                    $data['berkas'] = $request->file('berkas')->store('uploads/perbaikan_judul', 'public');
                }

                // Proses penerimaan: set tanggal dan sinkronkan judul ke ranpel
                if (isset($data['status']) && $data['status'] === 'diterima') {
                    if (empty($perbaikanJudul->tanggal_diterima)) {
                        $data['tanggal_diterima'] = now();
                    }

                    $judulBaru = $data['judul_baru'] ?? $perbaikanJudul->judul_baru;
                    if ($judulBaru) {
                        $perbaikanJudul->ranpel()->update([
                            'judul_penelitian' => $judulBaru,
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
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus perbaikan judul.
     *
     * @param  PerbaikanJudul  $perbaikanJudul
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(PerbaikanJudul $perbaikanJudul)
    {
        $perbaikanJudul->delete();

        return response()->json(['message' => 'Perbaikan judul berhasil dihapus.']);
    }

    /**
     * Tampilkan perbaikan judul milik mahasiswa tertentu.
     *
     * @param  int  $mahasiswaId
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getByMahasiswa($mahasiswaId)
    {
        $perbaikan = PerbaikanJudul::with(['mahasiswa', 'ranpel'])
            ->where('mahasiswa_id', $mahasiswaId)
            ->orderByDesc('created_at')
            ->get();

        return PerbaikanJudulResource::collection($perbaikan);
    }

    /**
     * Tampilkan perbaikan judul oleh dosen PA/pembimbing.
     *
     * Menampilkan semua perbaikan judul dari mahasiswa yang
     * dosen tersebut menjadi PA, pembimbing 1, atau pembimbing 2.
     *
     * @param  int  $dosenId
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
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
                'ranpel',
            ])
            ->orderByDesc('created_at')
            ->get();

        return PerbaikanJudulResource::collection($perbaikan);
    }
}
