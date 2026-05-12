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
        $mahasiswa = $this->route('mahasiswa');
        $userId = $mahasiswa instanceof \App\Models\Mahasiswa ? $mahasiswa->user_id : null;

        if (!$userId && is_numeric($mahasiswa)) {
            $userId = \App\Models\Mahasiswa::find($mahasiswa)?->user_id;
        }

        return [
            'nama' => 'sometimes|required|string|max:255',
            'nim' => 'prohibited',
            'email' => 'sometimes|email|unique:users,email,' . ($userId ?? 'NULL') . ',id',
            'alamat' => 'sometimes|nullable|string',
            'no_hp' => 'sometimes|nullable|string|max:30',
            'noHp' => 'sometimes|nullable|string|max:30',
            'prodi_id' => 'sometimes|exists:prodi,id',
            'prodiId' => 'sometimes|exists:prodi,id',
            'peminatan_id' => 'sometimes|nullable|exists:peminatan,id',
            'peminatanId' => 'sometimes|nullable|exists:peminatan,id',
            'semester' => 'sometimes|integer|min:1|max:14',
            'ipk' => 'sometimes|nullable|numeric|min:0|max:4',
            'dosenPa' => 'sometimes|nullable|exists:dosen,id',
            'dosen_pa' => 'sometimes|nullable|exists:dosen,id',
            'dosenId' => 'sometimes|nullable|exists:dosen,id', // alias untuk dosen_pa
            'pembimbing1' => 'sometimes|nullable|exists:dosen,id',
            'pembimbing_1' => 'sometimes|nullable|exists:dosen,id',
            'pembimbing2' => 'sometimes|nullable|exists:dosen,id',
            'pembimbing_2' => 'sometimes|nullable|exists:dosen,id',
            'status' => 'sometimes|string|in:aktif,cuti,lulus,nonaktif',
            'angkatan' => 'sometimes|string|size:4',
            'userId' => 'sometimes|exists:users,id',
            'user_id' => 'sometimes|exists:users,id',
            'file_ktm' => 'sometimes|nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'url_ktm' => 'sometimes|nullable|url',
            'url_transkrip_nilai' => 'sometimes|nullable|url',
            'url_bukti_lulus_metopen' => 'sometimes|nullable|url',
            'url_sertifikat_bta' => 'sometimes|nullable|url',
        ];
    }

    public function prepareForValidation(): void
    {
        $mergeData = [];
        if ($this->has('noHp')) $mergeData['no_hp'] = $this->noHp;
        if ($this->has('prodiId')) $mergeData['prodi_id'] = $this->prodiId;
        if ($this->has('peminatanId')) $mergeData['peminatan_id'] = $this->peminatanId;
        if ($this->has('dosenPa')) $mergeData['dosen_pa'] = $this->dosenPa;
        if ($this->has('dosenId')) $mergeData['dosen_id'] = $this->dosenId;
        if ($this->has('pembimbing1')) $mergeData['pembimbing_1'] = $this->pembimbing1;
        if ($this->has('pembimbing2')) $mergeData['pembimbing_2'] = $this->pembimbing2;
        if ($this->has('userId')) $mergeData['user_id'] = $this->userId;
        
        // Ensure alamat is also handled if needed, though it's usually already correct
        if ($this->has('alamat')) $mergeData['alamat'] = $this->alamat;

        if (!empty($mergeData)) {
            $this->merge($mergeData);
        }
    }
}
