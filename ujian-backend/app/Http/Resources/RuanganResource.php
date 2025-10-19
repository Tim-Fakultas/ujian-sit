<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RuanganResource extends JsonResource
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
            'prodi' => [
                'id' => $this->prodi->id,
                'nama_prodi' => $this->prodi->nama_prodi,
            ],
            'namaRuangan' => $this->nama_ruangan,
        ];
    }
}
