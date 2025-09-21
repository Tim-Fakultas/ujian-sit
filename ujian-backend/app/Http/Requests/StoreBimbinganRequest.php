<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBimbinganRequest extends FormRequest
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
            'skripsi_id' => 'required|exists:skripsi,id',
            'pembimbing_1' => 'required|exists:dosen,id',
            'pembimbing_2' => 'required|exists:dosen,id',
            'keterangan' => 'nullable|string',
        ];
    }
}
