<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDaftarKehadiranRequest extends FormRequest
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
            'ujianId' => 'required|exists:ujian,id',
            'dosenId' => 'required|exists:dosen,id',
            'statusKehadiran' => 'required|in:hadir,tidak hadir,izin',
            'keterangan' => 'nullable|string|max:255',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'ujian_id' => $this->input('ujianId'),
            'dosen_id' => $this->input('dosenId'),
            'status_kehadiran' => $this->input('statusKehadiran'),
            'keterangan' => $this->keterangan,
        ]);
    }
}
