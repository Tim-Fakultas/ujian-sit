<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDosenRequest;
use App\Http\Requests\UpdateDosenRequest;
use App\Http\Resources\DosenResource;
use App\Models\Dosen;
use Illuminate\Support\Facades\Cache;


class DosenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(\Illuminate\Http\Request $request)
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
     * Store a newly created resource in storage.
     */
    public function store(StoreDosenRequest $request)
    {
        $request->validated();
        $dosen = Dosen::create($request->all());

        Cache::forget('dosen_all');

        return new DosenResource($dosen);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $dosen = Cache::remember("dosen_{$id}", 600, function () use ($id) {
            return Dosen::with('prodi')->findOrFail($id);
        });

        return new DosenResource($dosen);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDosenRequest $request, Dosen $dosen)
    {
        $validatedData = $request->validated();

        if ($request->hasFile('ttd')) {
            // Delete old signature if exists
            if ($dosen->url_ttd && \Illuminate\Support\Facades\Storage::disk('public')->exists($dosen->url_ttd)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($dosen->url_ttd);
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
     * Remove the specified resource from storage.
     */
    public function destroy(Dosen $dosen)
    {
        $dosen->delete();

        Cache::forget('dosen_all');

        return response()->json(['message' => 'Dosen berhasil dihapus.'], 200);
    }

    public function monitorBimbingan()
    {
        // Get all Dosen with their supervised students
        $dosenList = Dosen::with([
            'mahasiswaBimbingan1.ujian.jenisUjian',
            'mahasiswaBimbingan2.ujian.jenisUjian'
        ])->get();

        $data = $dosenList->map(function ($dosen) {
            $b1 = $dosen->mahasiswaBimbingan1;
            $b2 = $dosen->mahasiswaBimbingan2;

            // Merge both collections
            $allStudents = $b1->merge($b2);

            $total = $allStudents->count();

            // Selesai jika status di DB lulus/selesai/wisuda ATAU lulus ujian skripsi
            $selesai = $allStudents->filter(function ($m) {
                $statusDb = in_array(strtolower($m->status), ['lulus', 'selesai', 'wisuda']);

                $lulusSkripsi = $m->ujian->contains(function ($u) {
                    $jenis = strtolower($u->jenisUjian->nama_jenis ?? '');
                    return str_contains($jenis, 'skripsi') && strtolower($u->hasil) === 'lulus';
                });

                return $statusDb || $lulusSkripsi;
            })->count();

            $belum = $total - $selesai;

            // Breakdown of active students status
            $proses = $allStudents->groupBy('status')->map->count();

            return [
                'id' => $dosen->id,
                'nama' => $dosen->nama,
                'nip' => $dosen->nip,
                'total_bimbingan' => $total,
                'selesai' => $selesai,
                'belum_selesai' => $belum,
                'detail_status' => $proses
            ];
        });

        // Sort by total bimbingan desc
        $sortedData = $data->sortByDesc('total_bimbingan')->values();

        return response()->json(['data' => $sortedData]);
    }

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
            'mahasiswaPa.ujian.jenisUjian'
        ])->findOrFail($id);

        $mapMahasiswa = function ($m) {
            $latestPengajuan = $m->pengajuanRanpel->sortByDesc('created_at')->first();
            $judul = $latestPengajuan?->ranpel?->judul_penelitian ?? 'Belum ada judul';
            $ranpelStatus = $latestPengajuan?->status ?? 'Belum mengajukan';

            $lulusSkripsi = $m->ujian->contains(function ($u) {
                $jenis = strtolower($u->jenisUjian->nama_jenis ?? '');
                return str_contains($jenis, 'skripsi') && strtolower($u->hasil) === 'lulus';
            });

            $status = $m->status;
            if ($lulusSkripsi) {
                $status = 'Lulus'; // Override status for display
            }

            return [
                'id' => $m->id,
                'nama' => $m->nama,
                'nim' => $m->nim,
                'status' => $status,
                'prodi' => $m->prodi->nama ?? '-',
                'angkatan' => $m->angkatan,
                'judul' => $judul,
                'sudah_ranpel' => $latestPengajuan ? true : false,
                'ranpel_status' => $ranpelStatus,
            ];
        };

        return response()->json([
            'data' => [
                'dosen' => [
                    'id' => $dosen->id,
                    'nama' => $dosen->nama,
                    'nip' => $dosen->nip,
                ],
                'pembimbing1' => $dosen->mahasiswaBimbingan1->map($mapMahasiswa),
                'pembimbing2' => $dosen->mahasiswaBimbingan2->map($mapMahasiswa),
                'pa' => $dosen->mahasiswaPa->map($mapMahasiswa),
            ]
        ]);
    }
}
