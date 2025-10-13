<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKomponenPenilaianRequest extends FormRequest
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
            'jenisUjianId' => 'required|exists:jenis_ujian,id',
            'namaKomponen' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'bobot' => 'required|numeric|min:0|max:100',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'jenis_ujian_id' => $this->input('jenisUjianId'),
            'nama_komponen' => $this->input('namaKomponen'),
            'deskripsi' => $this->input('deskripsi'),
            'bobot' => $this->input('bobot'),
        ]);
    }
}
