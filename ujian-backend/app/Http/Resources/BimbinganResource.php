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
            "mahasiswa"=> $this->mahasiswa ? [
                'id' => $this->mahasiswa->id,
                'nama' => $this->mahasiswa->nama,
                'nim' => $this->mahasiswa->nim,
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
