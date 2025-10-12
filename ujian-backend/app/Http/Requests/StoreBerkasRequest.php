<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBerkasRequest extends FormRequest
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
            'pendaftaranUjianId' => 'required|exists:pendaftaran_ujian,id',
            'namaBerkas' => 'required|string|max:255',
            'filePath' => 'required|string',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'pendaftaran_ujian_id' => $this->pendaftaranUjianId,
            'nama_berkas' => $this->namaBerkas,
            'file_path' => $this->filePath,
        ]);
    }
}
