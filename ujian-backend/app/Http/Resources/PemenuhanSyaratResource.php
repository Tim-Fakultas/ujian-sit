<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PemenuhanSyaratResource extends JsonResource
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
            'pendaftaranUjianId' => $this->pendaftaranUjian_id,
            'pendaftaranUjian' => $this->pendaftaranUjian ? [
                'id' => $this->pendaftaranUjian->id,
                'status' => $this->pendaftaranUjian->status,
            ] : null,
            'syaratId' => $this->syarat_id,
            'syarat' => $this->syarat ? [
                'id' => $this->syarat->id,
                'namaSyarat' => $this->syarat->nama_syarat,
            ] : null,
            'filePath' => $this->file_path,
            'fileName' => $this->file_name,
            'fileSize' => $this->file_size,
            'mimeType' => $this->mime_type,
            'keterangan' => $this->keterangan,
            'status' => $this->status,
            'verifiedBy' => $this->verified_by,
            'verifiedAt' => $this->verified_at,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
