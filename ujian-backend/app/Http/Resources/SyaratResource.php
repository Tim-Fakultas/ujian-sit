<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SyaratResource extends JsonResource
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
            'jenisUjianId' => $this->jenisUjian->id,
            'jenisUjian' => $this->jenisUjian ? [
                'id' => $this->jenisUjian->id,
                'namaJenis' => $this->jenisUjian->nama_jenis,
            ] : null,
            'namaSyarat' => $this->nama_syarat,
            'kategori' => $this->kategori,
            'deskripsi' => $this->deskripsi,
            'wajib' => $this->wajib,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
