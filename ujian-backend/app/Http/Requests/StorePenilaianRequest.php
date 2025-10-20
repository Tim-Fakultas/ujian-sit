<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePenilaianRequest extends FormRequest
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
     */
    public function rules(): array
    {
        // Jika request punya array "data", berarti batch insert
        if ($this->has('data') && is_array($this->data)) {
            return [
                'data' => 'required|array',
                'data.*.ujian_id' => 'required|exists:ujian,id',
                'data.*.dosen_id' => 'required|exists:dosen,id',
                'data.*.komponen_penilaian_id' => 'required|exists:komponen_penilaian,id',
                'data.*.nilai' => 'required|numeric|min:0|max:100',
                'data.*.komentar' => 'nullable|string|max:255',
            ];
        }

        // Kalau bukan batch (single data)
        return [
            'ujian_id' => 'required|exists:ujian,id',
            'dosen_id' => 'required|exists:dosen,id',
            'komponen_penilaian_id' => 'required|exists:komponen_penilaian,id',
            'nilai' => 'required|numeric|min:0|max:100',
            'komentar' => 'nullable|string|max:255',
        ];
    }
}
