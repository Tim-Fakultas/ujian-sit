<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MahasiswaResource extends JsonResource
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
            'nama' => $this->nama,
            'nim' => $this->nim,
            'noHp' => $this->no_hp,
            'alamat' => $this->alamat,
            'semester' => $this->semester,
            'ipk' => $this->ipk ? (float) $this->ipk : 0.00,
            'dosenPaId' => $this->dosen_pa,
            'prodi' => $this->prodi ? [
                'id' => $this->prodi->id,
                'nama' => $this->prodi->nama_prodi,
            ] : null,
            'peminatan' => $this->peminatan ? [
                'id' => $this->peminatan->id,
                'nama' => $this->peminatan->nama_peminatan,
            ] : null,
            'dosenPa' => $this->dosenPembimbingAkademik ? [
                'id' => $this->dosenPembimbingAkademik->id,
                'nama' => $this->dosenPembimbingAkademik->nama,
            ] : null,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
