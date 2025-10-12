<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DosenResource extends JsonResource
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
            'nidn' => $this->nidn,
            'nip' => $this->nip,
            'nama' => $this->nama,
            'noHp' => $this->no_hp,
            'alamat' => $this->alamat,
            'tempatTanggalLahir' => $this->tempat_tanggal_lahir,
            'pangkat' => $this->pangkat,
            'golongan' => $this->golongan,
            'tmtFst' => $this->tmt_fst,
            'jabatan' => $this->jabatan,
            'foto' => $this->foto,
            'userId' => $this->user_id,
            'prodi' => $this->prodi ? [
                'id' => $this->prodi->id,
                'nama' => $this->prodi->nama_prodi,
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
