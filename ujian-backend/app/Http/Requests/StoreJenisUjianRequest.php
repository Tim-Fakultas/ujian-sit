<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJenisUjianRequest extends FormRequest
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
            'nama_jenis' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ];
    }

    public function prepareForValidation(): void
    {
        $map = [];

        if ($this->has('namaJenis')) {
            $map['nama_jenis'] = $this->input('namaJenis');
        }

        if ($this->has('deskripsi')) {
            $map['deskripsi'] = $this->input('deskripsi');
        }

        $this->merge($map);
    }
}
