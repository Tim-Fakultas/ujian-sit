<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProdiRequest extends FormRequest
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
            "nama_prodi"=> "sometimes|string|max:255|unique:prodi,nama_prodi," . ($this->route('prodi')?->id ?? null),
            "fakultas_id"=> "required|exists:fakultas,id",
        ];
    }
}
