<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJadwalPengujiRequest extends FormRequest
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
            'dosen_id' => 'required|exists:dosen,id',
            'peran' => 'required|in:ketua_penguji,sekretaris_penguji,penguji_1,penguji_2',
        ];
    }
}
