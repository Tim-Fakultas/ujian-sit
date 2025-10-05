<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BimbinganResource extends JsonResource
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
            'skripsiId' => $this->skripsi_id,
            'mahasiswa' => $this->mahasiswa ? [
                'id' => $this->mahasiswa->id,
                'nama' => $this->mahasiswa->nama,
                'nim' => $this->mahasiswa->nim,
            ] : null,
            'dosen' => $this->dosen ? [
                'id' => $this->dosen->id,
                'nama' => $this->dosen->nama,
                'nip' => $this->dosen->nip,
            ] : null,
            'keterangan' => $this->keterangan,
            'filePath' => $this->file_path,
            'status' => $this->status,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
