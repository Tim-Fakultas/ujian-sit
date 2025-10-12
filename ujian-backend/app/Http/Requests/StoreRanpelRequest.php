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
            'judul_penelitian' => 'required|string|max:255',
            'masalah_dan_penyebab'=> 'required|string',
            'alternatif_solusi'=> 'required|string',
            'metode_penelitian' => 'nullable|string',
            'hasil_yang_diharapkan' => 'nullable|string',
            'kebutuhan_data'=> 'nullable|string',
        ];
    }
}
