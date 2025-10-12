<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PengajuanRanpelResource extends JsonResource
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
            'ranpel' => $this->whenLoaded('ranpel') ? new RanpelResource($this->ranpel) : null,
            'mahasiswa' => $this->whenLoaded('mahasiswa') ? new MahasiswaResource($this->mahasiswa) : null,
            'tanggalPengajuan' => $this->tanggal_pengajuan,
            'tanggalDiterima' => $this->tanggal_diterima,
            'status' => $this->status,
            'keterangan' => $this->keterangan,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
