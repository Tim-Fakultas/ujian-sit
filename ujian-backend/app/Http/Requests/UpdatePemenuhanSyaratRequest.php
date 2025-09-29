<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePemenuhanSyaratRequest extends FormRequest
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
            'pendaftaran_ujian_id' => 'prohibited',
            'syarat_id' => 'prohibited',
            'file_path' => 'nullable|string',
            'file_name' => 'nullable|string|max:255',
            'file_size' => 'nullable|integer|min:0',
            'mime_type' => 'nullable|string|max:100',
            'keterangan' => 'nullable|string',
            'status' => 'required|in:menunggu,valid,invalid',
            'verified_by' => 'nullable|exists:users,id',
            'verified_at' => 'nullable|date',
        ];
    }
}
