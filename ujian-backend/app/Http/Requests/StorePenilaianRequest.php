<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePenilaianRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('data') && is_array($this->data)) {
            // Convert data array from camelCase to snake_case
            $transformedData = array_map(function ($item) {
                return [
                    'ujian_id' => $item['ujianId'],
                    'dosen_id' => $item['dosenId'],
                    'komponen_penilaian_id' => $item['komponenPenilaianId'],
                    'nilai' => $item['nilai'],
                    'komentar' => $item['komentar'] ?? null,
                ];
            }, $this->data);

            $this->merge(['data' => $transformedData]);
        } else {
            // Untuk single insert
            $data = [
                'ujian_id' => $this->input('ujianId'),
                'dosen_id' => $this->input('dosenId'),
                'komponen_penilaian_id' => $this->input('komponenPenilaianId'),
                'nilai' => $this->input('nilai'),
                'komentar' => $this->input('komentar'),
            ];

            // Debug untuk melihat data yang akan dimerge
            \Log::info('Data after conversion:', $data);

            $this->merge($data);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Jika request punya array "data", berarti batch insert
        if ($this->has('data') && is_array($this->data)) {
            return [
                'data' => 'required|array',
                'data.*.ujian_id' => 'required|exists:ujian,id',
                'data.*.dosen_id' => 'required|exists:dosen,id',
                'data.*.komponen_penilaian_id' => 'required|exists:komponen_penilaian,id',
                'data.*.nilai' => 'required|numeric|min:0|max:100',
                'data.*.komentar' => 'nullable|string|max:255',
            ];
        }

        // Kalau bukan batch (single data)
        return [
            'ujian_id' => 'required|exists:ujian,id',
            'dosen_id' => 'required|exists:dosen,id',
            'komponen_penilaian_id' => 'required|exists:komponen_penilaian,id',
            'nilai' => 'required|numeric|min:0|max:100',
            'komentar' => 'nullable|string|max:255',
        ];
    }
}
