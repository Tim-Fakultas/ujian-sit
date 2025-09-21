<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDosenRequest extends FormRequest
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
            'nama'=> 'sometimes|required|string|max:255',
            'nidn'=> 'prohibited',
            'no_hp'=> 'sometimes|required|string|max:30',
            'alamat'=> 'sometimes|nullable|string',
            'prodi_id'=> 'sometimes|required|exists:prodi,id'
        ];
    }
}
