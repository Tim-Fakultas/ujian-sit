<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMahasiswaRequest extends FormRequest
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
            "nama" => "sometimes|required|string|max:255",
            "nim" => "prohibited",
            "alamat" => "sometimes|nullable|string",
            "no_hp" => "sometimes|nullable|string|max:30",
            "prodi_id" => "sometimes|exists:prodi,id",
            "peminatan_id" => "sometimes|nullable|exists:peminatan,id",
            "semester" => "sometimes|integer|min:1|max:14",
            "ipk" => "sometimes|nullable|numeric|min:0|max:4",
            "dosen_pa" => "sometimes|nullable|exists:dosen,id",
            "dosen_id" => "sometimes|nullable|exists:dosen,id", // alias untuk dosen_pa
        ];
    }
}
