<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRanpelRequest extends FormRequest
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
            'judul_id' => 'sometimes|exists:judul,id',
            'identifikasi_masalah' => 'sometimes|string',
            'rumusan_masalah' => 'sometimes|string',
            'penelitian_sebelumnya' => 'sometimes|string',
            'pokok_masalah' => 'sometimes|string',
            'deskripsi_lengkap' => 'sometimes|string',
            'status' => 'sometimes|in:menunggu,disetujui,ditolak',
        ];
    }
}
