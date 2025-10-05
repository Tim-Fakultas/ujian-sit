<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDosenRequest extends FormRequest
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
            'nama' => 'required|string|max:255',
            'nidn' => 'required|string|max:20|unique:dosen,nidn',
            'no_hp' => 'required|string|max:30',
            'alamat' => 'nullable|string',
            'prodi_id' => 'required|exists:prodi,id',
        ];
    }
}
