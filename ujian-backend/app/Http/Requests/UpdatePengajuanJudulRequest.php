<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePengajuanJudulRequest extends FormRequest
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
            'mahasiswa_id' => 'prohibited',
            'judul' => 'sometimes|required|string|max:255',
            'deskripsi' => 'sometimes|required|string',
            'tanggal_pengajuan' => 'prohibited',
            'tanggal_disetujui' => 'sometimes|nullable|date|after_or_equal:tanggal_pengajuan',
            'status' => 'sometimes|nullable|string|max:50',
            'dosen_id' => 'sometimes|nullable|exists:dosen,id',
            'keterangan' => 'sometimes|nullable|string',
        ];
    }
}
