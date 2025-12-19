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
            'mahasiswa_id' => 'prohibited',
            'ranpel_id' => 'sometimes|exists:ranpel,id',
            'jenis_ujian_id' => 'sometimes|exists:jenis_ujian,id',
            'tanggal_pengajuan' => 'nullable|date',
            'tanggal_disetujui' => 'nullable|date',
            'status' => 'sometimes|in:menunggu,belum dijadwalkan,dijadwalkan,selesai,ditolak',
            'keterangan' => 'nullable|string',
            'berkas' => 'nullable|array',
            'berkas.*' => 'file|mimes:pdf,jpg,jpeg,png|max:2048',
        ];
    }

    public function prepareForValidation(): void
{
    // Kita hanya mengambil input yang benar-benar ada di request
    $inputs = array_filter([
        'ranpel_id' => $this->input('ranpelId'),
        'jenis_ujian_id' => $this->input('jenisUjianId'),
        'tanggal_pengajuan' => $this->input('tanggalPengajuan'),
        'tanggal_disetujui' => $this->input('tanggalDisetujui'),
    ], fn($value) => !is_null($value));

    if (!empty($inputs)) {
        $this->merge($inputs);
    }
}
}
