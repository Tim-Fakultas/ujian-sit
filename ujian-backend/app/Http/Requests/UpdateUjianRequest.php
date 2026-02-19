<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUjianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Tidak boleh diubah
            'pendaftaranUjianId' => 'prohibited',
            'mahasiswaId' => 'prohibited',
            'jenisUjianId' => 'prohibited',

            // Boleh diubah sebagian
            'hariUjian' => 'sometimes|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'jadwalUjian' => 'sometimes|date',
            'waktuMulai' => 'sometimes|date_format:H:i',
            'waktuSelesai' => [
                'sometimes',
                'date_format:H:i',
                'after:waktuMulai',
                function ($attribute, $value, $fail) {
                    if ($this->filled(['waktuMulai', 'waktuSelesai'])) {
                        $waktuMulai = strtotime($this->input('waktuMulai'));
                        $waktuSelesai = strtotime($value);
                        $durasi = ($waktuSelesai - $waktuMulai) / 3600;
                        if ($durasi > 4) {
                            $fail('Durasi ujian tidak boleh lebih dari 4 jam.');
                        }
                    }
                }
            ],
            'ruanganId' => 'sometimes|exists:ruangan,id',

            // Penguji
            'penguji' => 'sometimes|array|min:1|max:4',
            'penguji.*.dosen_id' => [
                'required_with:penguji',
                'distinct',
                'exists:dosen,id',
            ],
            'penguji.*.peran' => [
                'required_with:penguji',
                Rule::in(['ketua_penguji', 'sekretaris_penguji', 'penguji_1', 'penguji_2']),
                'distinct',
            ],

            // Hasil & nilai
            'hasil' => 'sometimes|nullable|in:lulus,tidak lulus',
            'nilaiAkhir' => [
                'sometimes', 'nullable', 'numeric', 'min:0', 'max:100',
                function ($attribute, $value, $fail) {
                    $hasil = $this->input('hasil');
                    if ($hasil === 'lulus' && $value !== null && $value < 70) {
                        $fail('Nilai minimum kelulusan adalah 70.');
                    }
                    if ($hasil === 'tidak lulus' && $value !== null && $value >= 70) {
                        $fail('Nilai di bawah 70 tidak dapat dinyatakan lulus.');
                    }
                }
            ],

            // Keputusan (hanya untuk ujian hasil / skripsi)
            'keputusanId' => [
                'sometimes', 'nullable',
                'exists:keputusan,id',
                function ($attribute, $value, $fail) {
                    // Hindari error jika relasi tidak dimuat
                    $jenisUjian = optional($this->ujian->jenisUjian)->nama_jenis;
                    if ($value) {
                        if (!in_array(strtolower($jenisUjian), ['ujian hasil', 'ujian skripsi'])) {
                            $fail('Keputusan hanya bisa diisi untuk ujian hasil dan ujian skripsi.');
                        }
                    }
                }
            ],

            'catatan' => 'sometimes|nullable|string',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Otomatis tentukan hariUjian dari jadwalUjian jika ada
        if ($this->has('jadwalUjian')) {
            $hariJadwal = strtolower(date('l', strtotime($this->input('jadwalUjian'))));
            $hariIndonesia = [
                'monday' => 'Senin',
                'tuesday' => 'Selasa',
                'wednesday' => 'Rabu',
                'thursday' => 'Kamis',
                'friday' => 'Jumat',
                'saturday' => 'Sabtu',
                'sunday' => 'Minggu',
            ];

            $this->merge([
                'hariUjian' => $hariIndonesia[$hariJadwal] ?? null,
            ]);
        }

        if($this->has('penguji') && is_array($this->input('penguji'))) {
            $mappedPenguji = collect($this->input('penguji'))->map(function($item){
                $roleMapped = [
                    'ketuaPenguji' => 'ketua_penguji',
                    'sekretarisPenguji' => 'sekretaris_penguji',
                    'penguji1' => 'penguji_1',
                    'penguji2' => 'penguji_2',
                ];

                return [
                    'dosen_id' => $item['dosen_id'] ?? $item['dosenId'] ?? null,
                    'peran' => $roleMapped[$item['peran']] ?? $item['peran'] ?? null,
                ];
            })->toArray();

            $this->merge([
                'penguji' => $mappedPenguji,
            ]);
        }



        // Normalisasi nama field ke snake_case (sesuai kolom di DB)
        $mapped = [
            'hari_ujian' => $this->input('hariUjian'),
            'jadwal_ujian' => $this->input('jadwalUjian'),
            'waktu_mulai' => $this->input('waktuMulai'),
            'waktu_selesai' => $this->input('waktuSelesai'),
            'ruangan_id' => $this->input('ruanganId'),
            'ketua_penguji' => $this->input('ketuaPenguji'),
            'sekretaris_penguji' => $this->input('sekretarisPenguji'),
            'penguji_1' => $this->input('penguji1'),
            'penguji_2' => $this->input('penguji2'),
            'keputusan_id' => $this->input('keputusanId'),
            'nilai_akhir' => $this->input('nilaiAkhir'),
        ];

        // Hanya merge field yang terisi untuk menghindari overwrite null
        $this->merge(array_filter($mapped, fn($v) => $v !== null));
    }

}
