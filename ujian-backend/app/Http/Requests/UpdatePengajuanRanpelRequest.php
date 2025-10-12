<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePengajuanRanpelRequest extends FormRequest
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
            'mahasiswa_id' => 'sometimes|exists:mahasiswa,id',
            'ranpel_id' => 'sometimes|exists:ranpel,id',
            'tanggal_pengajuan' => 'sometimes|date',
            'tanggal_diterima' => 'nullable|date',
            'status' => 'nullable|string',  // Temporarily remove strict validation to debug
            'keterangan' => 'nullable|string',
        ];
    }
    
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Log the input to help debug
        \Log::info('Update PengajuanRanpel Request Data:', $this->all());
    }
}
