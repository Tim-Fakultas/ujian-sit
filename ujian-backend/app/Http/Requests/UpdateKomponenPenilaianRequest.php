<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKomponenPenilaianRequest extends FormRequest
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
            'jenisUjianId' => 'prohibited',
            'namaKomponen' => 'sometimes|string|max:255',
            'deskripsi' => 'nullable|string',
            'bobot' => 'sometimes|numeric|min:0|max:100',
        ];
    }

    public function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('namaKomponen')) {
            $data['nama_komponen'] = $this->input('namaKomponen');
        }

        if ($this->has('deskripsi')) {
            $data['deskripsi'] = $this->input('deskripsi');
        }

        if ($this->has('bobot')) {
            $data['bobot'] = $this->input('bobot');
        }

        $this->merge($data);
    }

}
