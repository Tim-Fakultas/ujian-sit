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
            "id"=> $this->id,
            "skripsiId"=> $this->skripsi_id,
            "mahasiswa" => $this->skripsi && $this->skripsi->pengajuan && $this->skripsi->pengajuan->mahasiswa ? [
                'id' => $this->skripsi->pengajuan->mahasiswa->id,
                'nama' => $this->skripsi->pengajuan->mahasiswa->nama,
                'nim' => $this->skripsi->pengajuan->mahasiswa->nim,
            ] : null,
            "pembimbing1"=> $this->pembimbing1 ? [
                'id' => $this->pembimbing1->id,
                'nama' => $this->pembimbing1->nama,
            ] : null,
            "pembimbing2"=> $this->pembimbing2 ? [
                'id' => $this->pembimbing2->id,
                'nama' => $this->pembimbing2->nama,
            ] : null,
            "keterangan"=> $this->keterangan,
            "createdAt"=> $this->created_at,
            "updatedAt"=> $this->updated_at,
            ];
    }
}
