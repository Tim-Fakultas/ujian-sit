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
            'status' => $this->status,
            'angkatan' => $this->angkatan,
            'userId' => $this->user_id,
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
                'nip' => $this->dosenPembimbingAkademik->nip,
                'nidn' => $this->dosenPembimbingAkademik->nidn,
                'nama' => $this->dosenPembimbingAkademik->nama,
            ] : null,
            'pembimbing1' => $this->pembimbing1 ? [
                'id' => $this->pembimbing1->id,
                'nip' => $this->pembimbing1->nip,
                'nidn' => $this->pembimbing1->nidn,
                'nama' => $this->pembimbing1->nama,
            ] : null,
            'pembimbing2' => $this->pembimbing2 ? [
                'id' => $this->pembimbing2->id,
                'nip' => $this->pembimbing2->nip,
                'nidn' => $this->pembimbing2->nidn,
                'nama' => $this->pembimbing2->nama,
            ] : null,
            'user' => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ] : null,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
