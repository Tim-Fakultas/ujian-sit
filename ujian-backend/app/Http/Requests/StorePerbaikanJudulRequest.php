<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePerbaikanJudulRequest extends FormRequest
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
            'ranpel_id' => ['required', 'exists:ranpel,id'],
            'mahasiswa_id' => ['required', 'exists:mahasiswa,id'],
            'judul_lama' => ['prohibited'],
            'judul_baru' => ['required', 'string', 'max:255'],
            'berkas' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:2048'],
            'status' => ['nullable', Rule::in(['menunggu', 'diterima', 'ditolak'])],
            'tanggal_perbaikan' => ['nullable', 'date'],
            'tanggal_diterima' => ['nullable', 'date'],
        ];
    }

    public function prepareForValidation(): void
    {
        $map = [];

        if ($this->has('ranpelId'))         $map['ranpel_id'] = $this->input('ranpelId');
        if ($this->has('mahasiswaId'))      $map['mahasiswa_id'] = $this->input('mahasiswaId');
        if ($this->has('judulLama'))        $map['judul_lama'] = $this->input('judulLama');
        if ($this->has('judulBaru'))        $map['judul_baru'] = $this->input('judulBaru');
        if ($this->has('berkas'))           $map['berkas'] = $this->input('berkas');
        if ($this->has('status'))           $map['status'] = $this->input('status');
        if ($this->has('tanggalPerbaikan')) $map['tanggal_perbaikan'] = $this->input('tanggalPerbaikan');
        if ($this->has('tanggalDiterima'))  $map['tanggal_diterima'] = $this->input('tanggalDiterima');

        $this->merge($map);
    }
}
