<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerbaikanJudulResource extends JsonResource
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
            'ranpel' => new RanpelResource($this->whenLoaded('ranpel')),
            'mahasiswa' => new MahasiswaResource($this->whenLoaded('mahasiswa')),
            'judulLama' => $this->judul_lama,
            'judulBaru' => $this->judul_baru,
            'berkas' => $this->berkas,
            'status' => $this->status,
            'tanggalPerbaikan' => $this->tanggal_perbaikan,
            'tanggalDiterima' => $this->tanggal_diterima,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
