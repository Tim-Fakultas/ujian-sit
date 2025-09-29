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
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ujian_id' => 'required|exists:ujian,id',
            'dosen_id' => 'required|exists:dosen,id',
            'komponen_penilaian_id' => 'required|exists:komponen_penilaian,id',
            'nilai' => 'required|numeric|min:0|max:100',
            'komentar' => 'nullable|string',
        ];
    }
}
