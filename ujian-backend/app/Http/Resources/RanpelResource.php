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
            'judulPenelitian' => $this->judul_penelitian,
            'masalahDanPenyebab' => $this->masalah_dan_penyebab,
            'alternatifSolusi' => $this->alternatif_solusi,
            'metodePenelitian' => $this->metode_penelitian,
            'hasilYangDiharapkan' => $this->hasil_yang_diharapkan,
            'kebutuhanData' => $this->kebutuhan_data,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
