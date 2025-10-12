<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDosenRequest extends FormRequest
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
            'nidn' => 'nullable|string|max:20|unique:dosen,nidn',
            'nip' => 'nullable|string|max:20|unique:dosen,nip',
            'noHp' => 'nullable|string|max:30',
            'alamat' => 'nullable|string',
            'tempatTanggalLahir' => 'nullable|string',
            'pangkat' => 'nullable|string',
            'golongan' => 'nullable|string',
            'tmtFst' => 'nullable|date',
            'jabatan' => 'nullable|string',
            'prodiId' => 'required|exists:prodi,id',
            'foto' => 'nullable|string',
            'userId' => 'nullable|exists:users,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'no_hp' => $this->noHp,
            'tempat_tanggal_lahir' => $this->tempatTanggalLahir,
            'tmt_fst' => $this->tmtFst,
            'prodi_id' => $this->prodiId,
            'user_id' => $this->userId,
        ]);
    }
}
