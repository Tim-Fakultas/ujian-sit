<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRanpelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pengajuan_judul_id' => 'required|exists:pengajuan_judul,id',
            'judul' => 'required|string|max:500',
            'identifikasi_masalah' => 'required|string',
            'rumusan_masalah' => 'required|string',
            'penelitian_sebelumnya' => 'required|string',
            'pokok_masalah' => 'required|string',
            'deskripsi_lengkap' => 'required|string',
            'status' => 'required|in:draft,proses,disetujui,ditolak',
        ];
    }
}
