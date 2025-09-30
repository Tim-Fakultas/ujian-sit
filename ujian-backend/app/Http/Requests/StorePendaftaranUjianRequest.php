<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePendaftaranUjianRequest extends FormRequest
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
            'mahasiswa_id' => 'required|exists:mahasiswa,id',
            'jenis_ujian_id' => 'required|exists:jenis_ujian,id',
            'skripsi_id' => 'required|exists:skripsi,id',
            'status' => 'required|in:menunggu,terverifikasi,dijadwalkan,selesai',
            'created_by' => 'required|exists:users,id',
            'verified_by' => 'nullable|exists:users,id',
            'verified_at' => 'nullable|date',
            'keterangan' => 'nullable|string',
        ];
    }
}
