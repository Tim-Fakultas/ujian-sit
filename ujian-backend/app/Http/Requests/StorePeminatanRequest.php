<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePeminatanRequest extends FormRequest
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
            'nama_peminatan' => 'required|string|max:255|unique:peminatan,nama_peminatan',
            'prodi_id' => 'required|exists:prodi,id',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_peminatan.required' => 'Nama peminatan wajib diisi',
            'nama_peminatan.unique' => 'Nama peminatan sudah ada',
            'nama_peminatan.max' => 'Nama peminatan maksimal 255 karakter',
            'prodi_id.required' => 'Prodi wajib dipilih',
            'prodi_id.exists' => 'Prodi tidak ditemukan',
        ];
    }
}
