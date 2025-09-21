<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkripsiRequest extends FormRequest
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
            'pengajuan_id' => 'required|exists:pengajuan,id',
            'judul_skripsi' => 'required|string|max:255',
            'identifikasi_masalah' => 'required|string|max:255',
            'rumusan_masalah' => 'nullable|string',
            'penelitian_sebelumnya' => 'nullable|string',
            'pokok_masalah' => 'nullable|string',
            'deskripsi_lengkap' => 'nullable|string',
            'status' => 'nullable|string|max:50',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
        ];
    }
}
