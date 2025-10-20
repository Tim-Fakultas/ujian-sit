<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePenilaianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Jika batch update (pakai key "data")
        if ($this->has('data') && is_array($this->data)) {
            return [
                'data' => 'required|array',
                'data.*.id' => 'required|exists:penilaian,id',
                'data.*.nilai' => 'required|numeric|min:0|max:100',
                'data.*.komentar' => 'nullable|string|max:255',

                // field relasi tetap dilarang diubah
                'data.*.ujian_id' => 'prohibited',
                'data.*.dosen_id' => 'prohibited',
                'data.*.komponen_penilaian_id' => 'prohibited',
            ];
        }

        // Kalau update satu record saja
        return [
            'nilai' => 'required|numeric|min:0|max:100',
            'komentar' => 'nullable|string|max:255',
            'ujian_id' => 'prohibited',
            'dosen_id' => 'prohibited',
            'komponen_penilaian_id' => 'prohibited',
        ];
    }
}
