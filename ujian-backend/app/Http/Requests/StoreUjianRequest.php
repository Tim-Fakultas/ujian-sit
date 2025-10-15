<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUjianRequest extends FormRequest
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
            'pendaftaranUjianId' => 'required|exists:pendaftaran_ujian,id',
            'mahasiswaId' => 'required|exists:mahasiswa,id',
            'jenisUjianId' => 'required|exists:jenis_ujian,id',
            'hariUjian' => 'required|in:senin,selasa,rabu,kamis,jumat,sabtu,minggu',
            'jadwalUjian' => 'required|date',
            'waktuMulai' => 'required|date_format:H:i',
            'waktuSelesai' => 'required|date_format:H:i|after:waktu_mulai',
            'ruangan' => 'required|string|max:255',
            'ketuaPenguji' => 'nullable|exists:dosen,id',
            'sekretarisPenguji' => 'nullable|exists:dosen,id',
            'penguji1' => 'nullable|exists:dosen,id',
            'penguji2' => 'nullable|exists:dosen,id',
            'hasil' => 'nullable|in:lulus,tidak lulus',
            'nilaiAkhir' => 'nullable|numeric|min:0|max:100',
            'catatan' => 'nullable|string',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'pendaftaran_ujian_id' => $this->input('pendaftaranUjianId'),
            'mahasiswa_id' => $this->input('mahasiswaId'),
            'jenis_ujian_id' => $this->input('jenisUjianId'),
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
