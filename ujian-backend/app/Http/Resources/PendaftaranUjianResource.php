<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendaftaranUjianResource extends JsonResource
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
            'mahasiswaId' => $this->mahasiswa_id,
            'mahasiswa' => $this->mahasiswa ? [
                'id' => $this->mahasiswa->id,
                'nama' => $this->mahasiswa->nama,
                'nim' => $this->mahasiswa->nim,
            ] : null,
            'jenisUjianId' => $this->jenis_ujian_id,
            'jenisUjian' => $this->jenis_ujian ? [
                'id' => $this->jenis_ujian->id,
                'namaJenis' => $this->jenis_ujian->nama_jenis,
            ] : null,
            'skripsiId' => $this->skripsi_id,
            'skripsi' => $this->skripsi ? [
                'id' => $this->skripsi->id,
                'judul' => $this->skripsi->judul,
            ] : null,
            'status' => $this->status,
            'createdBy' => $this->created_by,
            'verifiedBy' => $this->verified_by,
            'verifiedAt' => $this->verified_at,
            'keterangan' => $this->keterangan,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
