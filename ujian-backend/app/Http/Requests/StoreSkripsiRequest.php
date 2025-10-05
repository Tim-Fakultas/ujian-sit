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
            'mahasiswa_id' => 'required|exists:mahasiswa,id',
            'ranpel_id' => 'required|exists:ranpel,id',
            'judul' => 'required|string|max:255',
            'pembimbing_1' => 'required',
            'pembimbing_2' => 'required',
            'status' => 'required',
        ];
    }
}
