<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UjianResource extends JsonResource
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
            'pendaftaranUjian' => $this->pendaftaranUjian ? [
                'id' => $this->pendaftaranUjian->id,
                'ranpelId' => $this->pendaftaranUjian->ranpel_id,
                'jenisUjianId' => $this->pendaftaranUjian->jenis_ujian_id,
                'tanggalPengajuan' => $this->pendaftaranUjian->tanggal_pengajuan,
                'tanggalDisetujui' => $this->pendaftaranUjian->tanggal_disetujui,
                'status' => $this->pendaftaranUjian->status,
            ] : null,
            'judulPenelitian' => $this->pendaftaranUjian->ranpel->judul_penelitian ?? null,
            'mahasiswa' => $this->mahasiswa ? [
                'id' => $this->mahasiswa->id,
                'nama' => $this->mahasiswa->nama,
                'nim' => $this->mahasiswa->nim,
                'prodi' => $this->mahasiswa->prodi ? [
                    'id' => $this->mahasiswa->prodi->id,
                    'namaProdi' => $this->mahasiswa->prodi->nama_prodi,
                ] : null,
                'pembimbing1' => $this->mahasiswa->pembimbing1 ? [
                    'id' => $this->mahasiswa->pembimbing1->id,
                    'nip' => $this->mahasiswa->pembimbing1->nip,
                    'nidn' => $this->mahasiswa->pembimbing1->nidn,
                    'nama' => $this->mahasiswa->pembimbing1->nama,
                ] : null,
                'pembimbing2' => $this->mahasiswa->pembimbing2 ? [
                    'id' => $this->mahasiswa->pembimbing2->id,
                    'nip' => $this->mahasiswa->pembimbing2->nip,
                    'nidn' => $this->mahasiswa->pembimbing2->nidn,
                    'nama' => $this->mahasiswa->pembimbing2->nama,
                ] : null,
            ] : null,
            'jenisUjian' => $this->jenisUjian ? [
                'id' => $this->jenisUjian->id,
                'namaJenis' => $this->jenisUjian->nama_jenis,
            ] : null,
            'hariUjian' => $this->hari_ujian,
            'jadwalUjian' => $this->jadwal_ujian,
            'waktuMulai' => $this->waktu_mulai,
            'waktuSelesai' => $this->waktu_selesai,
            'ruangan' => $this->ruangan ? [
                'id' => $this->ruangan->id,
                'namaRuangan' => $this->ruangan->nama_ruangan,
                'prodi' => $this->ruangan->prodi ? [
                    'id' => $this->ruangan->prodi->id,
                    'namaProdi' => $this->ruangan->prodi->nama_prodi,
                ] : null,
            ] : null,
            'penguji' => $this->whenLoaded('dosenPenguji', function () {
                return $this->dosenPenguji->map(function ($dosen) {
                    return [
                        'id' => $dosen->id,
                        'nama' => $dosen->nama,
                        'nip' => $dosen->nip,
                        'nidn' => $dosen->nidn,
                        'peran' => $dosen->pivot->peran,
                    ];
                });
            }),
            'hasil' => $this->hasil,
            'nilaiAkhir' => $this->nilai_akhir,
            'keputusan' => $this->keputusan ? [
                'id' => $this->keputusan->id,
                'kode' => $this->keputusan->kode,
                'namaKeputusan' => $this->keputusan->nama_keputusan,
            ] : null,
            'catatan' => $this->catatan,
        ];
    }
}
