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
            'mahasiswa_id' => 'prohibited',
            'jenis_ujian_id' => 'prohibited',
            'skripsi_id' => 'prohibited',
            'status' => 'sometimes|in:menunggu,terverifikasi,dijadwalkan,selesai',
            'created_by' => 'prohibited',
            'verified_by' => 'nullable|exists:users,id',
            'verified_at' => 'nullable|date',
            'keterangan' => 'nullable|string',
        ];
    }
}
