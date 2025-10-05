<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUjianRequest extends FormRequest
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
            'pendaftaran_ujian_id' => 'prohibited',
            'jenis_ujian_id' => 'prohibited',
            'mahasiswa_id' => 'prohibited',
            'jadwal_ujian' => 'sometimes|date',
            'waktu_mulai' => 'sometimes|date_format:H:i',
            'waktu_selesai' => 'sometimes|date_format:H:i|after:waktu_mulai',
            'ruangan' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:dijadwalkan,berlangsung,selesai,dibatalkan',
            'hasil' => 'nullable|in:lulus,tidak lulus',
            'nilai' => 'nullable|numeric|min:0|max:100',
            'catatan' => 'nullable|string',
            'created_by' => 'prohibited',
            'updated_by' => 'nullable|exists:users,id',
        ];
    }
}
