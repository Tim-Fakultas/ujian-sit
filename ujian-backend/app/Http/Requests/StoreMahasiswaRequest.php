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
            'noHp' => 'nullable|string|max:30',
            'prodiId' => 'required|exists:prodi,id',
            'peminatanId' => 'nullable|exists:peminatan,id',
            'semester' => 'required|integer|min:1|max:14',
            'ipk' => 'nullable|numeric|min:0|max:4',
            'dosenPa' => 'nullable|exists:dosen,id',
            'pembimbing1' => 'nullable|exists:dosen,id',
            'pembimbing2' => 'nullable|exists:dosen,id',
            'status' => 'required|string|in:aktif,cuti,lulus,nonaktif',
            'angkatan' => 'required|string|size:4',
            'userId' => 'required|exists:users,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'no_hp' => $this->noHp,
            'prodi_id' => $this->prodiId,
            'peminatan_id' => $this->peminatanId,
            'dosen_pa' => $this->dosenPa,
            'pembimbing_1' => $this->pembimbing1,
            'pembimbing_2' => $this->pembimbing2,
            'user_id' => $this->userId,
        ]);
    }
}
