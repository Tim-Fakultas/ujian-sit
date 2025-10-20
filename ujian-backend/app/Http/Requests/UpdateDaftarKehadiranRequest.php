<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDaftarKehadiranRequest extends FormRequest
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
            'ujianId' => 'sometimes|exists:ujian,id',
            'dosenId' => 'sometimes|exists:dosen,id',
            'peran' => 'sometimes|in:ketua_penguji,sekretaris_penguji,penguji_1,penguji_2',
            'statusKehadiran' => 'sometimes|in:hadir,tidak hadir,izin',
            'keterangan' => 'nullable|string|max:255',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'ujian_id' => $this->input('ujianId'),
            'dosen_id' => $this->input('dosenId'),
            'peran' => $this->peran,
            'status_kehadiran' => $this->input('statusKehadiran'),
            'keterangan' => $this->keterangan,
        ]);
    }
}
