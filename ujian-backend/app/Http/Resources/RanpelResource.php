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
            'pengajuanJudulId' => $this->pengajuan_judul_id,
            'pengajuanJudul' => $this->pengajuan_judul ? [
                'id' => $this->pengajuan_judul->id,
                'judul' => $this->pengajuan_judul->judul,
                'mahasiswa' => $this->pengajuan_judul->mahasiswa ? [
                    'id' => $this->pengajuan_judul->mahasiswa->id,
                    'nama' => $this->pengajuan_judul->mahasiswa->nama,
                    'nim' => $this->pengajuan_judul->mahasiswa->nim,
                ] : null,
            ] : null,
            'judul' => $this->judul,
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
