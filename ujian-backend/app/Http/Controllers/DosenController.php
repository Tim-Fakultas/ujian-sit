<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDosenRequest;
use App\Http\Requests\UpdateDosenRequest;
use App\Http\Resources\DosenResource;
use App\Models\Dosen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

/**
 * DosenController — Mengelola data dosen.
 *
 * Menyediakan CRUD untuk entity Dosen, termasuk upload tanda tangan,
 * monitoring bimbingan mahasiswa, dan detail bimbingan per dosen.
 * Menggunakan cache untuk optimasi query.
 */
class DosenController extends Controller
{
    /**
     * Tampilkan daftar semua dosen.
     *
     * Mendukung filter berdasarkan `user_id` via query parameter.
     * Data di-cache selama 10 menit.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        if ($request->has('user_id')) {
            $userId = $request->query('user_id');
            $dosen = Dosen::with('prodi')->where('user_id', $userId)->get();

            return DosenResource::collection($dosen);
        }

        $dosen = Cache::remember('dosen_all', 600, function () {
            return Dosen::with('prodi')->get();
        });

        return DosenResource::collection($dosen);
    }

    /**
     * Simpan data dosen baru.
     *
     * @param  StoreDosenRequest  $request
     * @return DosenResource
     */
    public function store(StoreDosenRequest $request)
    {
        $dosen = Dosen::create($request->validated());

        Cache::forget('dosen_all');

        return new DosenResource($dosen);
    }

    /**
     * Tampilkan detail satu dosen berdasarkan ID.
     *
     * Data di-cache selama 10 menit per dosen.
     *
     * @param  int  $id
     * @return DosenResource
     */
    public function show($id)
    {
        $dosen = Cache::remember("dosen_{$id}", 600, function () use ($id) {
            return Dosen::with('prodi')->findOrFail($id);
        });

        return new DosenResource($dosen);
    }

    /**
     * Update data dosen.
     *
     * Mendukung upload file tanda tangan digital (field `ttd`).
     * File lama akan dihapus otomatis jika ada file baru.
     *
     * @param  UpdateDosenRequest  $request
     * @param  Dosen  $dosen
     * @return DosenResource
     */
    public function update(UpdateDosenRequest $request, Dosen $dosen)
    {
        $validatedData = $request->validated();

        // Upload tanda tangan baru, hapus yang lama
        if ($request->hasFile('ttd')) {
            if ($dosen->url_ttd && Storage::disk('public')->exists($dosen->url_ttd)) {
                Storage::disk('public')->delete($dosen->url_ttd);
            }

            $path = $request->file('ttd')->store('signatures', 'public');
            $validatedData['url_ttd'] = $path;
        }

        unset($validatedData['ttd']);

        $dosen->update($validatedData);

        Cache::forget('dosen_all');
        Cache::forget("dosen_{$dosen->id}");

        return new DosenResource($dosen);
    }

    /**
     * Hapus data dosen.
     *
     * @param  Dosen  $dosen
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Dosen $dosen)
    {
        $dosen->delete();

        Cache::forget('dosen_all');

        return response()->json(['message' => 'Dosen berhasil dihapus.'], 200);
    }

    /**
     * Monitor bimbingan seluruh dosen.
     *
     * Menghitung statistik: total mahasiswa bimbingan, yang sudah selesai,
     * dan yang belum selesai. Mahasiswa dianggap "selesai" jika statusnya
     * lulus/selesai/wisuda ATAU sudah lulus ujian skripsi.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function monitorBimbingan()
    {
        $dosenList = Dosen::with([
            'mahasiswaBimbingan1.ujian.jenisUjian',
            'mahasiswaBimbingan2.ujian.jenisUjian',
        ])->get();

        $data = $dosenList->map(function ($dosen) {
            $allStudents = $dosen->mahasiswaBimbingan1->merge($dosen->mahasiswaBimbingan2);
            $total = $allStudents->count();

            // Hitung mahasiswa yang sudah selesai
            $selesai = $allStudents->filter(function ($m) {
                $statusDb = in_array(strtolower($m->status), ['lulus', 'selesai', 'wisuda']);
                $lulusSkripsi = $m->ujian->contains(function ($u) {
                    $jenis = strtolower($u->jenisUjian->nama_jenis ?? '');
                    return str_contains($jenis, 'skripsi') && strtolower($u->hasil) === 'lulus';
                });

                return $statusDb || $lulusSkripsi;
            })->count();

            return [
                'id'              => $dosen->id,
                'nama'            => $dosen->nama,
                'nip'             => $dosen->nip,
                'total_bimbingan' => $total,
                'selesai'         => $selesai,
                'belum_selesai'   => $total - $selesai,
                'detail_status'   => $allStudents->groupBy('status')->map->count(),
            ];
        });

        $sortedData = $data->sortByDesc('total_bimbingan')->values();

        return response()->json(['data' => $sortedData]);
    }

    /**
     * Detail bimbingan per dosen — daftar mahasiswa yang dibimbing.
     *
     * Mengelompokkan mahasiswa berdasarkan peran dosen:
     * - Pembimbing 1
     * - Pembimbing 2
     * - Pembimbing Akademik (PA)
     *
     * Setiap mahasiswa dilengkapi info judul penelitian dan status ranpel.
     *
     * @param  int  $id  ID Dosen
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBimbinganDetails($id)
    {
        $dosen = Dosen::with([
            'mahasiswaBimbingan1.prodi',
            'mahasiswaBimbingan1.pengajuanRanpel.ranpel',
            'mahasiswaBimbingan1.ujian.jenisUjian',
            'mahasiswaBimbingan2.prodi',
            'mahasiswaBimbingan2.pengajuanRanpel.ranpel',
            'mahasiswaBimbingan2.ujian.jenisUjian',
            'mahasiswaPa.prodi',
            'mahasiswaPa.pengajuanRanpel.ranpel',
            'mahasiswaPa.ujian.jenisUjian',
        ])->findOrFail($id);

        // Transformer untuk data mahasiswa
        $mapMahasiswa = function ($m) {
            $latestPengajuan = $m->pengajuanRanpel->sortByDesc('created_at')->first();
            $judul = $latestPengajuan?->ranpel?->judul_penelitian ?? 'Belum ada judul';
            $ranpelStatus = $latestPengajuan?->status ?? 'Belum mengajukan';

            // Override status jika sudah lulus ujian skripsi
            $lulusSkripsi = $m->ujian->contains(function ($u) {
                $jenis = strtolower($u->jenisUjian->nama_jenis ?? '');
                return str_contains($jenis, 'skripsi') && strtolower($u->hasil) === 'lulus';
            });

            return [
                'id'            => $m->id,
                'nama'          => $m->nama,
                'nim'           => $m->nim,
                'status'        => $lulusSkripsi ? 'Lulus' : $m->status,
                'prodi'         => $m->prodi->nama ?? '-',
                'angkatan'      => $m->angkatan,
                'judul'         => $judul,
                'sudah_ranpel'  => $latestPengajuan !== null,
                'ranpel_status' => $ranpelStatus,
            ];
        };

        return response()->json([
            'data' => [
                'dosen' => [
                    'id'   => $dosen->id,
                    'nama' => $dosen->nama,
                    'nip'  => $dosen->nip,
                ],
                'pembimbing1' => $dosen->mahasiswaBimbingan1->map($mapMahasiswa),
                'pembimbing2' => $dosen->mahasiswaBimbingan2->map($mapMahasiswa),
                'pa'          => $dosen->mahasiswaPa->map($mapMahasiswa),
            ],
        ]);
    }
}
