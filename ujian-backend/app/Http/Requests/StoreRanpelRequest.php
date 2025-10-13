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
            'judulPenelitian' => 'required|string|max:255',
            'masalahDanPenyebab' => 'nullable|string',
            'alternatifSolusi' => 'nullable|string',
            'metodePenelitian' => 'nullable|string',
            'hasilYangDiharapkan' => 'nullable|string',
            'kebutuhanData' => 'nullable|string',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'judul_penelitian' => $this->judulPenelitian,
            'masalah_dan_penyebab' => $this->masalahDanPenyebab,
            'alternatif_solusi' => $this->alternatifSolusi,
            'metode_penelitian' => $this->metodePenelitian,
            'hasil_yang_diharapkan' => $this->hasilYangDiharapkan,
            'kebutuhan_data' => $this->kebutuhanData,
        ]);
    }

}
