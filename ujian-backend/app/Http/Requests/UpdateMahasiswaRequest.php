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
            'nama' => 'sometimes|required|string|max:255',
            'nim' => 'prohibited',
            'alamat' => 'sometimes|nullable|string',
            'noHp' => 'sometimes|nullable|string|max:30',
            'prodiId' => 'sometimes|exists:prodi,id',
            'peminatanId' => 'sometimes|nullable|exists:peminatan,id',
            'semester' => 'sometimes|integer|min:1|max:14',
            'ipk' => 'sometimes|nullable|numeric|min:0|max:4',
            'dosenPa' => 'sometimes|nullable|exists:dosen,id',
            'dosenId' => 'sometimes|nullable|exists:dosen,id', // alias untuk dosen_pa
            'pembimbing1' => 'sometimes|nullable|exists:dosen,id',
            'pembimbing2' => 'sometimes|nullable|exists:dosen,id',
            'status' => 'sometimes|string|in:aktif,cuti,lulus,nonaktif',
            'angkatan' => 'sometimes|string|size:4',
            'userId' => 'sometimes|exists:users,id',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'no_hp' => $this->noHp,
            'prodi_id' => $this->prodiId,
            'peminatan_id' => $this->peminatanId,
            'dosen_pa' => $this->dosenPa,
            'dosen_id' => $this->dosenId, // alias untuk dosen_pa
            'pembimbing_1' => $this->pembimbing1,
            'pembimbing_2' => $this->pembimbing2,
            'user_id' => $this->userId,
        ]);
    }
}
