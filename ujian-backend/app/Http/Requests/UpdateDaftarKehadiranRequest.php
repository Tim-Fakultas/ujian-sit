<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDaftarKehadiranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        // ubah hanya key yang dikirim dari frontend camelCase → snake_case
        $this->merge([
            'ujian_id' => $this->input('ujianId'),
            'dosen_id' => $this->input('dosenId'),
            'status_kehadiran' => $this->input('statusKehadiran'),
        ]);
    }

    public function rules(): array
    {
        return [
            'ujian_id' => 'sometimes|exists:ujian,id',
            'dosen_id' => 'sometimes|exists:dosen,id',
            'status_kehadiran' => 'sometimes|in:hadir,tidak hadir,izin',
            'keterangan' => 'nullable|string|max:255',
        ];
    }
}
