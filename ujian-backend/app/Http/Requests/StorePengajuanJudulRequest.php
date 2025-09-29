<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePengajuanJudulRequest extends FormRequest
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
            "mahasiswa_id" => "required|exists:mahasiswa,id",
            "judul" => "required|string|max:255",
            "deskripsi"=> "required|string",
            "tanggal_pengajuan" => "nullable|date",
            "tanggal_disetujui" => "nullable|date|after_or_equal:tanggal_pengajuan",
            "status" => "nullable|string|max:50",
            "dosen_id" => "nullable|exists:dosen,id",
            "keterangan" => "nullable|string",
        ];
    }
}
