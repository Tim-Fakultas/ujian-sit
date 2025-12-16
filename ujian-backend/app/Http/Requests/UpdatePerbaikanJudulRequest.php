<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePerbaikanJudulRequest extends FormRequest
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
            'judul_lama' => ['sometimes', 'string', 'max:255'],
            'judul_baru' => ['sometimes', 'string', 'max:255'],
            'berkas' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:2048'],
            'status' => ['sometimes', Rule::in(['menunggu', 'diterima', 'ditolak'])],
            'tanggal_diterima' => ['sometimes', 'date'],
        ];
    }

    public function prepareForValidation(): void
    {
        $map = [];

        if ($this->has('judulLama'))       $map['judul_lama'] = $this->input('judulLama');
        if ($this->has('judulBaru'))       $map['judul_baru'] = $this->input('judulBaru');
        if ($this->has('tanggalDiterima')) $map['tanggal_diterima'] = $this->input('tanggalDiterima');

        $this->merge($map);
    }
}
