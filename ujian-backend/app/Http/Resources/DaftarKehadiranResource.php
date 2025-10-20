<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DaftarKehadiranResource extends JsonResource
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
            'ujianId' => $this->ujian_id,
            'dosenId' => $this->dosen_id,
            'peran' => $this->peran,
            'statusKehadiran' => $this->status_kehadiran,
            'keterangan' => $this->keterangan,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
