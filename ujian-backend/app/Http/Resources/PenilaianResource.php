<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PenilaianResource extends JsonResource
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
            'ujian' => $this->ujian ? [
                'id' => $this->ujian->id,
                'jadwalUjian' => $this->ujian->jadwal_ujian,
            ] : null,
            'dosenId' => $this->dosen_id,
            'dosen' => $this->dosen ? [
                'id' => $this->dosen->id,
                'nama' => $this->dosen->nama,
                'nidn' => $this->dosen->nidn,
            ] : null,
            'komponenPenilaianId' => $this->komponen_penilaian_id,
            'komponenPenilaian' => $this->komponen_penilaian ? [
                'id' => $this->komponen_penilaian->id,
                'namaKomponen' => $this->komponen_penilaian->nama_komponen,
                'bobot' => $this->komponen_penilaian->bobot,
            ] : null,
            'nilai' => $this->nilai,
            'komentar' => $this->komentar,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
