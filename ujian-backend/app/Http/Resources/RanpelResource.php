<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RanpelResource extends JsonResource
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
            'judulId' => $this->judul_id,
            'judul' => $this->judul ? [
                'id' => $this->judul->id,
                'judul' => $this->judul->judul,
            ] : null,
            'identifikasiMasalah' => $this->identifikasi_masalah,
            'rumusanMasalah' => $this->rumusan_masalah,
            'penelitianSebelumnya' => $this->penelitian_sebelumnya,
            'pokokMasalah' => $this->pokok_masalah,
            'deskripsiLengkap' => $this->deskripsi_lengkap,
            'status' => $this->status,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
