<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PendaftaranUjianResource extends JsonResource
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
            'mahasiswa' => $this->mahasiswa ? [
                'id' => $this->mahasiswa->id,
                'nama' => $this->mahasiswa->nama,
                'nim' => $this->mahasiswa->nim,
                'prodiId' => $this->mahasiswa->prodi_id ? [
                    'id' => $this->mahasiswa->prodi->id,
                    'namaProdi' => $this->mahasiswa->prodi->nama_prodi,
                ] : null,
            ] : null,
            'ranpel' => $this->ranpel ? [
                'id' => $this->ranpel->id,
                'judulPenelitian' => $this->ranpel->judul_penelitian,
            ] : null,
            'jenisUjian' => $this->jenis_ujian ? [
                'id' => $this->jenis_ujian->id,
                'namaJenis' => $this->jenis_ujian->nama_jenis,
            ] : null,
            'tanggalPengajuan' => $this->tanggal_pengajuan,
            'tanggalDisetujui' => $this->tanggal_disetujui,
            'status' => $this->status,
            'berkas' => $this->berkas ? $this->berkas->map(function ($berkas) {
                return [
                    'id' => $berkas->id,
                    'namaBerkas' => $berkas->nama_berkas,
                    'filePath' => $berkas->file_path,
                    'uploadedAt' => $berkas->created_at,
                ];
            }) : [],
            'keterangan' => $this->keterangan,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
