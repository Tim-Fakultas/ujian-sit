<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePenilaianRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('data') && is_array($this->data)) {
            // Untuk batch update
            $transformedData = array_map(function ($item) {
                return [
                    'id' => $item['id'],
                    'nilai' => $item['nilai'],
                    'komentar' => $item['komentar'] ?? null,
                    // Convert camelCase ke snake_case untuk field yang dilarang
                    'ujian_id' => $item['ujianId'] ?? null,
                    'dosen_id' => $item['dosenId'] ?? null,
                    'komponen_penilaian_id' => $item['komponenPenilaianId'] ?? null,
                ];
            }, $this->data);

            $this->merge(['data' => $transformedData]);
        } else {
            // Untuk single update
            $this->merge([
                'nilai' => $this->nilai,
                'komentar' => $this->komentar,
                // Convert camelCase ke snake_case untuk field yang dilarang
                'ujian_id' => $this->ujianId,
                'dosen_id' => $this->dosenId,
                'komponen_penilaian_id' => $this->komponenPenilaianId,
            ]);
        }
    }

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

                // field relasi tetap dilarang diubah (dalam format camelCase)
                'data.*.ujianId' => 'prohibited',
                'data.*.dosenId' => 'prohibited',
                'data.*.komponenPenilaianId' => 'prohibited',
            ];
        }
Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException
The PUT method is not supported for route /. Supported methods: GET, HEAD.


        // Kalau update satu record saja
        return [
            'nilai' => 'required|numeric|min:0|max:100',
            'komentar' => 'nullable|string|max:255',
            'ujianId' => 'prohibited',
            'dosenId' => 'prohibited',
            'komponenPenilaianId' => 'prohibited',
        ];
    }
}
