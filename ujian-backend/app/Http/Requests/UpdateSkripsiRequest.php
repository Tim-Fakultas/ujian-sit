<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkripsiRequest extends FormRequest
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
            'pengajuan_id' => 'prohibited',
            'judul_skripsi' => 'sometimes|required|string|max:255',
            'identifikasi_masalah' => 'sometimes|required|string|max:255',
            'rumusan_masalah' => 'sometimes|nullable|string',
            'penelitian_sebelumnya' => 'sometimes|nullable|string',
            'pokok_masalah' => 'sometimes|nullable|string',
            'deskripsi_lengkap' => 'sometimes|nullable|string',
            'status' => 'sometimes|nullable|string|max:50',
            'tanggal_mulai' => 'sometimes|nullable|date',
            'tanggal_selesai' => 'sometimes|nullable|date|after_or_equal:tanggal_mulai',
        ];
    }
}
