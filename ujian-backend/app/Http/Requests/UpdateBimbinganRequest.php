<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBimbinganRequest extends FormRequest
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
            "skripsi_id"=>"prohibited",
            "pembimbing_1" => "sometimes|required|exists:dosen,id",
            "pembimbing_2"=> "sometimes|required|exists:dosen,id",
            "keterangan" => "sometimes|nullable|string",
        ];
    }
}
