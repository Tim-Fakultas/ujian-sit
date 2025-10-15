<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KomponenPenilaianResource extends JsonResource
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
            'namaKomponen' => $this->nama_komponen,
            'bobot' => $this->bobot,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
