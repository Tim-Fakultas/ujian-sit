<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeminatanResource extends JsonResource
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
            'nama_peminatan' => $this->nama_peminatan,
            'prodi_id' => $this->prodi_id,
            'prodi' => [
                'id' => $this->prodi->id,
                'nama_prodi' => $this->prodi->nama_prodi,
                'fakultas_id' => $this->prodi->fakultas_id,
            ],
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
