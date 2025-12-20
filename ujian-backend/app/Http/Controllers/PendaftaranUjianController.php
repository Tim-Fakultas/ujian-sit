<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePendaftaranUjianRequest;
use App\Http\Requests\UpdatePendaftaranUjianRequest;
use App\Http\Resources\PendaftaranUjianResource;
use App\Models\PendaftaranUjian;
use DB;
use Exception;

class PendaftaranUjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pendaftaranUjian = PendaftaranUjian::with(['mahasiswa', 'jenisUjian', 'ranpel', 'berkas'])->get();

        return PendaftaranUjianResource::collection($pendaftaranUjian);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePendaftaranUjianRequest $request)
    {
        try{
            return DB::transaction(function() use ($request) {
                $data = $request->validated();

                $pendaftaranUjian = PendaftaranUjian::create($data);

                // Simpan berkas jika ada
                if ($request->hasFile('berkas')) {
                    foreach ($request->file('berkas') as $file) {
                        $path = $file->store('uploads/berkas_ujian', 'public');
                        $pendaftaranUjian->berkas()->create([
                            'nama_berkas' => $file->getClientOriginalName(),
                            'file_path' => $path,
                        ]);
                    }
                }

                return new PendaftaranUjianResource($pendaftaranUjian);
            });
        }catch(Exception $e){
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
        $pendaftaranUjian = PendaftaranUjian::with(['mahasiswa', 'jenisUjian'])->findOrFail($id);

        return new PendaftaranUjianResource($pendaftaranUjian);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePendaftaranUjianRequest $request, PendaftaranUjian $pendaftaran_ujian)
    {
        try {
            return DB::transaction(function () use ($request, $pendaftaran_ujian){
                $validated = $request->validated();

                if(isset($validated['status']) &&
                   $validated['status'] === 'belum dijadwalkan' &&
                   empty($pendaftaran_ujian->tanggal_disetujui) &&
                   empty($validated['tanggal_disetujui'])
                )
                {
                    $validated['tanggal_disetujui'] = now();
                }

                $pendaftaran_ujian->update($validated);

                if($request->hasFile('berkas')){
                    foreach($request->file('berkas') as $file){
                        $path = $file->store('uploads/berkas_ujian', 'public');
                        $pendaftaran_ujian->berkas()->create([
                            'nama_berkas' => $file->getClientOriginalName(),
                            'file_path' => $path,
                        ]);
                    }
                }

                return new PendaftaranUjianResource(
                    $pendaftaran_ujian->fresh()->load(['mahasiswa', 'jenisUjian', 'ranpel', 'berkas']));
            });
        }
        catch(Exception $e){
            return response()->json([
                'message' => 'Gagal memperbarui pendaftaran ujian.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PendaftaranUjian $pendaftaranUjian)
    {
        $pendaftaranUjian->delete();

        return response()->json(['message' => 'Pendaftaran ujian berhasil dihapus.'], 200);
    }


    public function getByMahasiswa($id)
    {
        // ambil semua pendaftaran ujian milik mahasiswa ini
        $pendaftaran = PendaftaranUjian::with(['mahasiswa', 'ranpel', 'jenisUjian', 'berkas'])
            ->where('mahasiswa_id', $id)
            ->get();

        if ($pendaftaran->isEmpty()) {
            return response()->json([
                'message' => 'Belum ada pendaftaran ujian untuk mahasiswa ini.'
            ], 404);
        }

        return PendaftaranUjianResource::collection($pendaftaran);
    }

    public function showByMahasiswa($id, PendaftaranUjian $pendaftaran)
{
    // pastikan pendaftaran ini memang milik mahasiswa terkait
    if ($pendaftaran->mahasiswa_id != $id) {
        return response()->json([
            'message' => 'Data pendaftaran tidak sesuai dengan mahasiswa.'
        ], 403);
    }

    $pendaftaran->load(['mahasiswa', 'ranpel', 'jenisUjian', 'berkas']);

    return new PendaftaranUjianResource($pendaftaran);
}


    public function storeByMahasiswa(StorePendaftaranUjianRequest $request, $id)
    {
        try {
            $data = [
                'mahasiswa_id' => $id, // otomatis dari route param
                'ranpel_id' => $request->input('ranpelId'),
                'jenis_ujian_id' => $request->input('jenisUjianId'),

                'tanggal_pengajuan' => now(),
                'status' => $request->input('status', 'menunggu'),
                'keterangan' => $request->input('keterangan'),
            ];

            $pendaftaran = PendaftaranUjian::create($data);

            if ($request->hasFile('berkas')) {
                foreach ($request->file('berkas') as $file) {
                    $path = $file->store('uploads/berkas_ujian', 'public');
                    $pendaftaran->berkas()->create([
                        'nama_berkas' => $file->getClientOriginalName(),
                        'file_path' => $path,
                    ]);
                }
            }

            return new PendaftaranUjianResource($pendaftaran);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan pendaftaran ujian.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function updateByMahasiswa(UpdatePendaftaranUjianRequest $request, $id, PendaftaranUjian $pendaftaran)
    {
        try {
            if ($pendaftaran->mahasiswa_id != $id) {
                return response()->json([
                    'message' => 'Data pendaftaran tidak sesuai dengan mahasiswa.'
                ], 403);
            }

            $pendaftaran->update([
                'ranpel_id' => $request->input('ranpelId', $pendaftaran->ranpel_id),
                'jenis_ujian_id' => $request->input('jenisUjianId', $pendaftaran->jenis_ujian_id),
                'status' => $request->input('status', $pendaftaran->status),
                'keterangan' => $request->input('keterangan', $pendaftaran->keterangan),
            ]);

            if ($request->hasFile('berkas')) {
                foreach ($request->file('berkas') as $file) {
                    $path = $file->store('uploads/berkas_ujian', 'public');
                    $pendaftaran->berkas()->create([
                        'nama_berkas' => $file->getClientOriginalName(),
                        'file_path' => $path,
                    ]);
                }
            }

            return new PendaftaranUjianResource($pendaftaran);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui pendaftaran ujian.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroyByMahasiswa($id, PendaftaranUjian $pendaftaran)
    {
        if ($pendaftaran->mahasiswa_id != $id) {
            return response()->json([
                'message' => 'Data pendaftaran tidak sesuai dengan mahasiswa.'
            ], 403);
        }

        $pendaftaran->delete();

        return response()->json([
            'message' => 'Pendaftaran ujian berhasil dihapus.'
        ], 200);
    }


}
