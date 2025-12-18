<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePendaftaranUjianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mahasiswa_id'   => 'required|exists:mahasiswa,id',
            'ranpel_id'      => 'required|exists:ranpel,id',
            'jenis_ujian_id' => 'required|exists:jenis_ujian,id',

            'tanggal_pengajuan' => 'nullable|date',
            'tanggal_disetujui' => 'nullable|date',
            'status'            => 'nullable|in:menunggu,belum dijadwalkan,dijadwalkan,selesai,ditolak',
            'keterangan'        => 'nullable|string',

            'berkas'   => 'nullable|array',
            'berkas.*' => 'file|mimes:pdf,jpg,jpeg,png|max:2048', // 2MB
        ];
    }

    public function prepareForValidation(): void
    {
        $mahasiswaId = $this->input('mahasiswaId')
            ?? $this->route('id')
            ?? $this->route('mahasiswa')
            ?? $this->route('mahasiswa_id');

        $this->merge([
            'mahasiswa_id'      => $mahasiswaId,
            'ranpel_id'         => $this->input('ranpelId'),
            'jenis_ujian_id'    => $this->input('jenisUjianId'),
            'tanggal_pengajuan' => $this->input('tanggalPengajuan'),
            'tanggal_disetujui' => $this->input('tanggalDisetujui'),
        ]);
    }
}
