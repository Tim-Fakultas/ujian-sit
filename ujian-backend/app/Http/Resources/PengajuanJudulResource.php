<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PengajuanJudulResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "mahasiswa"=> $this->mahasiswa ? [
                "id" => $this->mahasiswa->id,
                "nim" => $this->mahasiswa->nim,
                "nama" => $this->mahasiswa->nama,
            ] : null,
            'judul' => $this->ranpel->judul ?? $this->judul,
            'deskripsi'=>$this->deskripsi,
            'tanggalPengajuan' => $this->tanggal_pengajuan,
            'tanggalDisetujui' => $this->tanggal_disetujui,
            'status' => $this->status,
            'keterangan' => $this->keterangan,
            "createdAt"=> $this->created_at,
            "updatedAt"=> $this->updated_at,
        ];
    }
}
