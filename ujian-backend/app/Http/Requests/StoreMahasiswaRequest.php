<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMahasiswaRequest extends FormRequest
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
            'nama' => 'required|string|max:255',
            'nim' => 'required|string|max:20|unique:mahasiswa,nim',
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string|max:30',
            'prodi_id' => 'required|exists:prodi,id',
            'peminatan_id' => 'nullable|exists:peminatan,id',
            'semester' => 'required|integer|min:1|max:14',
            'ipk' => 'nullable|numeric|min:0|max:4',
            'dosen_pa' => 'nullable|exists:dosen,id',
            'pembimbing_1' => 'nullable|exists:dosen,id',
            'pembimbing_2' => 'nullable|exists:dosen,id',
            'status' => 'required|string|in:aktif,cuti,lulus,nonaktif',
            'angkatan' => 'required|string|size:4',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
