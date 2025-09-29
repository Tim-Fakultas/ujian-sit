<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePenilaianRequest extends FormRequest
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
            'ujian_id' => 'prohibited',
            'dosen_id' => 'prohibited',
            'komponen_penilaian_id' => 'prohibited',
            'nilai' => 'required|numeric|min:0|max:100',
            'komentar' => 'nullable|string',
        ];
    }
}
