<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePendaftaranUjianRequest;
use App\Http\Requests\UpdatePendaftaranUjianRequest;
use App\Http\Resources\PendaftaranUjianResource;
use App\Models\PendaftaranUjian;
use Exception;
use Illuminate\Support\Facades\DB;

/**
 * PendaftaranUjianController — Mengelola pendaftaran ujian mahasiswa.
 *
 * Menyediakan CRUD untuk pendaftaran ujian (Seminar Proposal, Ujian Hasil,
 * Ujian Skripsi). Termasuk upload berkas pendukung dan operasi
 * yang terikat pada mahasiswa tertentu (nested route).
 */
class PendaftaranUjianController extends Controller
{
    /**
     * Tampilkan daftar semua pendaftaran ujian.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $pendaftaranUjian = PendaftaranUjian::with([
            'mahasiswa', 'jenisUjian', 'ranpel', 'berkas',
        ])->get();

        return PendaftaranUjianResource::collection($pendaftaranUjian);
    }

    /**
     * Simpan pendaftaran ujian baru.
     *
     * Menggunakan database transaction untuk atomicity.
     * Mendukung upload berkas ujian (multiple files).
     *
     * @param  StorePendaftaranUjianRequest  $request
     * @return PendaftaranUjianResource|\Illuminate\Http\JsonResponse
     */
    public function store(StorePendaftaranUjianRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $pendaftaranUjian = PendaftaranUjian::create($request->validated());

                // Simpan berkas pendukung jika ada
                if ($request->hasFile('berkas')) {
                    foreach ($request->file('berkas') as $file) {
                        $path = $file->store('uploads/berkas_ujian', 'public');
                        $pendaftaranUjian->berkas()->create([
                            'nama_berkas' => $file->getClientOriginalName(),
                            'file_path'   => $path,
                        ]);
                    }
                }

                return new PendaftaranUjianResource($pendaftaranUjian);
            });
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan pendaftaran ujian.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tampilkan detail satu pendaftaran ujian.
     *
     * @param  int  $id
     * @return PendaftaranUjianResource
     */
    public function show($id)
    {
        $pendaftaranUjian = PendaftaranUjian::with(['mahasiswa', 'jenisUjian'])->findOrFail($id);

        return new PendaftaranUjianResource($pendaftaranUjian);
    }

    /**
     * Update pendaftaran ujian.
     *
     * Otomatis mengisi `tanggal_disetujui` saat status diubah ke
     * "belum dijadwalkan" (artinya pendaftaran telah disetujui).
     *
     * @param  UpdatePendaftaranUjianRequest  $request
     * @param  PendaftaranUjian  $pendaftaran_ujian
     * @return PendaftaranUjianResource|\Illuminate\Http\JsonResponse
     */
    public function update(UpdatePendaftaranUjianRequest $request, PendaftaranUjian $pendaftaran_ujian)
    {
        try {
            return DB::transaction(function () use ($request, $pendaftaran_ujian) {
                $validated = $request->validated();

                // Auto-fill tanggal_disetujui saat status = "belum dijadwalkan"
                if (
                    isset($validated['status']) &&
                    $validated['status'] === 'belum dijadwalkan' &&
                    empty($pendaftaran_ujian->tanggal_disetujui) &&
                    empty($validated['tanggal_disetujui'])
                ) {
                    $validated['tanggal_disetujui'] = now();
                }

                $pendaftaran_ujian->update($validated);

                // Upload berkas tambahan jika ada
                if ($request->hasFile('berkas')) {
                    foreach ($request->file('berkas') as $file) {
                        $path = $file->store('uploads/berkas_ujian', 'public');
                        $pendaftaran_ujian->berkas()->create([
                            'nama_berkas' => $file->getClientOriginalName(),
                            'file_path'   => $path,
                        ]);
                    }
                }

                return new PendaftaranUjianResource(
                    $pendaftaran_ujian->fresh()->load(['mahasiswa', 'jenisUjian', 'ranpel', 'berkas'])
                );
            });
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui pendaftaran ujian.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus pendaftaran ujian.
     *
     * @param  PendaftaranUjian  $pendaftaranUjian
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(PendaftaranUjian $pendaftaranUjian)
    {
        $pendaftaranUjian->delete();

        return response()->json(['message' => 'Pendaftaran ujian berhasil dihapus.'], 200);
    }

    /**
     * Tampilkan daftar pendaftaran ujian milik mahasiswa tertentu.
     *
     * @param  int  $id  ID Mahasiswa
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|\Illuminate\Http\JsonResponse
     */
    public function getByMahasiswa($id)
    {
        $pendaftaran = PendaftaranUjian::with(['mahasiswa', 'ranpel', 'jenisUjian', 'berkas'])
            ->where('mahasiswa_id', $id)
            ->get();

        if ($pendaftaran->isEmpty()) {
            return response()->json([
                'message' => 'Belum ada pendaftaran ujian untuk mahasiswa ini.',
            ], 404);
        }

        return PendaftaranUjianResource::collection($pendaftaran);
    }

    /**
     * Tampilkan detail satu pendaftaran ujian milik mahasiswa.
     *
     * Memvalidasi bahwa pendaftaran benar-benar milik mahasiswa terkait.
     *
     * @param  int  $id  ID Mahasiswa
     * @param  PendaftaranUjian  $pendaftaran
     * @return PendaftaranUjianResource|\Illuminate\Http\JsonResponse
     */
    public function showByMahasiswa($id, PendaftaranUjian $pendaftaran)
    {
        if ($pendaftaran->mahasiswa_id != $id) {
            return response()->json([
                'message' => 'Data pendaftaran tidak sesuai dengan mahasiswa.',
            ], 403);
        }

        $pendaftaran->load(['mahasiswa', 'ranpel', 'jenisUjian', 'berkas']);

        return new PendaftaranUjianResource($pendaftaran);
    }

    /**
     * Simpan pendaftaran ujian oleh mahasiswa (via nested route).
     *
     * ID mahasiswa diambil dari route parameter, bukan dari request body.
     *
     * @param  StorePendaftaranUjianRequest  $request
     * @param  int  $id  ID Mahasiswa
     * @return PendaftaranUjianResource|\Illuminate\Http\JsonResponse
     */
    public function storeByMahasiswa(StorePendaftaranUjianRequest $request, $id)
    {
        try {
            $pendaftaran = PendaftaranUjian::create([
                'mahasiswa_id'     => $id,
                'ranpel_id'        => $request->input('ranpelId'),
                'jenis_ujian_id'   => $request->input('jenisUjianId'),
                'tanggal_pengajuan' => now(),
                'status'           => $request->input('status', 'menunggu'),
                'keterangan'       => $request->input('keterangan'),
            ]);

            // Upload berkas jika ada
            if ($request->hasFile('berkas')) {
                foreach ($request->file('berkas') as $file) {
                    $path = $file->store('uploads/berkas_ujian', 'public');
                    $pendaftaran->berkas()->create([
                        'nama_berkas' => $file->getClientOriginalName(),
                        'file_path'   => $path,
                    ]);
                }
            }

            return new PendaftaranUjianResource($pendaftaran);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan pendaftaran ujian.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update pendaftaran ujian oleh mahasiswa (via nested route).
     *
     * Memvalidasi kepemilikan data sebelum update.
     *
     * @param  UpdatePendaftaranUjianRequest  $request
     * @param  int  $id  ID Mahasiswa
     * @param  PendaftaranUjian  $pendaftaran
     * @return PendaftaranUjianResource|\Illuminate\Http\JsonResponse
     */
    public function updateByMahasiswa(UpdatePendaftaranUjianRequest $request, $id, PendaftaranUjian $pendaftaran)
    {
        try {
            if ($pendaftaran->mahasiswa_id != $id) {
                return response()->json([
                    'message' => 'Data pendaftaran tidak sesuai dengan mahasiswa.',
                ], 403);
            }

            $pendaftaran->update([
                'ranpel_id'      => $request->input('ranpelId', $pendaftaran->ranpel_id),
                'jenis_ujian_id' => $request->input('jenisUjianId', $pendaftaran->jenis_ujian_id),
                'status'         => $request->input('status', $pendaftaran->status),
                'keterangan'     => $request->input('keterangan', $pendaftaran->keterangan),
            ]);

            // Upload berkas tambahan jika ada
            if ($request->hasFile('berkas')) {
                foreach ($request->file('berkas') as $file) {
                    $path = $file->store('uploads/berkas_ujian', 'public');
                    $pendaftaran->berkas()->create([
                        'nama_berkas' => $file->getClientOriginalName(),
                        'file_path'   => $path,
                    ]);
                }
            }

            return new PendaftaranUjianResource($pendaftaran);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui pendaftaran ujian.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Hapus pendaftaran ujian oleh mahasiswa (via nested route).
     *
     * Memvalidasi kepemilikan data sebelum penghapusan.
     *
     * @param  int  $id  ID Mahasiswa
     * @param  PendaftaranUjian  $pendaftaran
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyByMahasiswa($id, PendaftaranUjian $pendaftaran)
    {
        if ($pendaftaran->mahasiswa_id != $id) {
            return response()->json([
                'message' => 'Data pendaftaran tidak sesuai dengan mahasiswa.',
            ], 403);
        }

        $pendaftaran->delete();

        return response()->json([
            'message' => 'Pendaftaran ujian berhasil dihapus.',
        ], 200);
    }
}
