<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProdiResource extends JsonResource
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
            "namaProdi"=> $this->nama_prodi,
            'fakultas' => $this->fakultas ? [
                'id' => $this->fakultas->id,
                'nama' => $this->fakultas->nama_fakultas,
            ] : null,
            "createdAt"=> $this->created_at,
            "updatedAt"=> $this->updated_at,
            ];
    }
}
