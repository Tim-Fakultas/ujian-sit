<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkripsiResource extends JsonResource
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
            'pengajuan' => $this->pengajuan ? [
                'id' => $this->pengajuan->id,
                'mahasiswa' => $this->pengajuan->mahasiswa ? [
                    'id' => $this->pengajuan->mahasiswa->id,
                    'nama' => $this->pengajuan->mahasiswa->nama,
                    'nim' => $this->pengajuan->mahasiswa->nim,
                ] : null,
                'dosen' => $this->pengajuan->dosen ? [
                    'id' => $this->pengajuan->dosen->id,
                    'nama' => $this->pengajuan->dosen->nama,
                    'nidn' => $this->pengajuan->dosen->nidn,
                ] : null,
                'statusPengajuan' => $this->pengajuan->status_pengajuan,
            ] : null,
            "judulSkripsi"=> $this->judul_skripsi,
            "identifikasiMasalah"=> $this->identifikasi_masalah,
            "rumusanMasalah"=> $this->rumusan_masalah,
            "penelitianSebelumnya"=> $this->penelitian_sebelumnya,
            "pokokMasalah"=> $this->pokok_masalah,
            "deskripsiLengkap"=> $this->deskripsi_lengkap,
            "status"=> $this->status,
            "tanggalMulai"=> $this->tanggal_mulai,
            "tanggalSelesai"=> $this->tanggal_selesai,
            "createdAt"=> $this->created_at,
            "updatedAt"=> $this->updated_at,
            

            ];
    }
}
