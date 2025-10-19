<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRuanganRequest extends FormRequest
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
            'prodiId' => 'sometimes|exists:prodi,id',
            'namaRuangan' => 'sometimes|string|max:100',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'prodi_id' => $this->prodiId,
            'nama_ruangan' => $this->namaRuangan,
        ]);
    }
}
