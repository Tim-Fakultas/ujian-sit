<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUjianRequest extends FormRequest
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
            'pendaftaran_ujian_id' => 'required|exists:pendaftaran_ujian,id',
            'jenis_ujian_id' => 'required|exists:jenis_ujian,id',
            'mahasiswa_id' => 'required|exists:mahasiswa,id',
            'jadwal_ujian' => 'required|date',
            'waktu_mulai' => 'required|date_format:H:i',
            'waktu_selesai' => 'required|date_format:H:i|after:waktu_mulai',
            'ruangan' => 'required|string|max:255',
            'status' => 'required|in:dijadwalkan,berlangsung,selesai,dibatalkan',
            'hasil' => 'nullable|in:lulus,tidak lulus',
            'nilai' => 'nullable|numeric|min:0|max:100',
            'catatan' => 'nullable|string',
            'created_by' => 'required|exists:users,id',
            'updated_by' => 'nullable|exists:users,id',
        ];
    }
}
