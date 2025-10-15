<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUjianRequest extends FormRequest
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
            'pendaftaranUjianId' => 'prohibited',
            'mahasiswaId' => 'prohibited',
            'jenisUjianId' => 'prohibited',
            'hariUjian' => 'sometimes|in:senin,selasa,rabu,kamis,jumat,sabtu,minggu',
            'jadwalUjian' => 'sometimes|date',
            'waktuMulai' => 'sometimes|date_format:H:i',
            'waktuSelesai' => 'sometimes|date_format:H:i|after:waktuMulai',
            'ruangan' => 'sometimes|string|max:255',
            'ketuaPenguji' => 'sometimes|nullable|exists:dosen,id',
            'sekretarisPenguji' => 'sometimes|nullable|exists:dosen,id',
            'penguji1' => 'sometimes|nullable|exists:dosen,id',
            'penguji2' => 'sometimes|nullable|exists:dosen,id',
            'hasil' => 'sometimes|nullable|in:lulus,tidak lulus',
            'nilaiAkhir' => 'sometimes|nullable|numeric|min:0|max:100',
            'catatan' => 'nullable|string',
        ];

    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'hari_ujian' => $this->input('hariUjian'),
            'jadwal_ujian' => $this->input('jadwalUjian'),
            'waktu_mulai' => $this->input('waktuMulai'),
            'waktu_selesai' => $this->input('waktuSelesai'),
            'ruangan' => $this->input('ruangan'),
            'ketua_penguji' => $this->input('ketuaPenguji'),
            'sekretaris_penguji' => $this->input('sekretarisPenguji'),
            'penguji_1' => $this->input('penguji1'),
            'penguji_2' => $this->input('penguji2'),
            'nilai_akhir' => $this->input('nilaiAkhir'),
        ]);
    }
}
