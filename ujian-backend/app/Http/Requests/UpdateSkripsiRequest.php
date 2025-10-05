<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkripsiRequest extends FormRequest
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
            'mahasiswa_id' => 'prohibited',
            'ranpel_id' => 'prohibited',
            'judul' => 'sometimes|string|max:255',
            'pembimbing_1' => 'sometimes|required',
            'pembimbing_2' => 'sometimes',
            'status' => 'sometimes',
        ];
    }
}
