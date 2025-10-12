<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePendaftaranUjianRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'mahasiswaId' => 'prohibited',
            'ranpelId' => 'sometimes|exists:ranpel,id',
            'jenisUjianId' => 'sometimes|exists:jenis_ujian,id',
            'tanggalPengajuan' => 'nullable|date',
            'tanggalDisetujui' => 'nullable|date',
            'status' => 'sometimes|in:menunggu,dijadwalkan,selesai,ditolak',
            'keterangan' => 'nullable|string',
            'berkas' => 'nullable|array',
            'berkas.*' => 'file|mimes:pdf,jpg,jpeg,png|max:2048',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'mahasiswa_id' => $this->mahasiswaId,
            'ranpel_id' => $this->ranpelId,
            'jenis_ujian_id' => $this->jenisUjianId,
            'tanggal_pengajuan' => $this->tanggalPengajuan,
            'tanggal_disetujui' => $this->tanggalDisetujui,
        ]);
    }
}
