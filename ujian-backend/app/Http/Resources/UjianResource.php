<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UjianResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pendaftaranUjianId' => $this->pendaftaran_ujian_id,
            'pendaftaranUjian' => $this->pendaftaran_ujian ? [
                'id' => $this->pendaftaran_ujian->id,
                'status' => $this->pendaftaran_ujian->status,
            ] : null,
            'jenisUjianId' => $this->jenis_ujian_id,
            'jenisUjian' => $this->jenis_ujian ? [
                'id' => $this->jenis_ujian->id,
                'namaJenis' => $this->jenis_ujian->nama_jenis,
            ] : null,
            'mahasiswaId' => $this->mahasiswa_id,
            'mahasiswa' => $this->mahasiswa ? [
                'id' => $this->mahasiswa->id,
                'nama' => $this->mahasiswa->nama,
                'nim' => $this->mahasiswa->nim,
            ] : null,
            'jadwalUjian' => $this->jadwal_ujian,
            'waktuMulai' => $this->waktu_mulai,
            'waktuSelesai' => $this->waktu_selesai,
            'ruangan' => $this->ruangan,
            'status' => $this->status,
            'hasil' => $this->hasil,
            'nilai' => $this->nilai,
            'catatan' => $this->catatan,
            'createdBy' => $this->created_by,
            'updatedBy' => $this->updated_by,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
