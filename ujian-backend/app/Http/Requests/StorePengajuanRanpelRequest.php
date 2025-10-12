<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePengajuanRanpelRequest extends FormRequest
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
            'mahasiswa_id' => 'required|exists:mahasiswa,id',
            'ranpel_id' => 'required|exists:ranpel,id',
            'tanggal_pengajuan' => 'nullable|date',
            'tanggal_diterima' => 'nullable|date',
            'status' => 'in:menunggu,diverifikasi,diterima,ditolak',
            'keterangan' => 'nullable|string',
        ];
    }
}
