<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'waktuSelesai' => [
                'required',
                'date_format:H:i',
                'after:waktuMulai',
                function ($attribute, $value, $fail) {
                    $waktuMulai = strtotime($this->input('waktuMulai'));
                    $waktuSelesai = strtotime($value);
                    $durasi = ($waktuSelesai - $waktuMulai) / 3600; // dalam jam
                    if ($durasi > 4) {
                        $fail('Durasi ujian tidak boleh lebih dari 4 jam.');
                    }
                }
            ],
            'ruanganId' => 'required|exists:ruangan,id',

            'penguji' => 'required|array|min:1|max:5',
            'penguji.*.dosen_id' => [
                'required',
                'exists:dosen,id',
                'distinct' // pastikan tidak duplikat
            ],
            'penguji.*.peran' => [
                'required',
                Rule::in(['ketua_penguji', 'sekretaris_penguji', 'penguji_1', 'penguji_2'])
            ],

            'hasil' => [
                'nullable',
                'in:lulus,tidak lulus',
                function ($attribute, $value, $fail) {
                    $keputusan = $this->input('keputusan');
                    if ($value === 'tidak lulus' && $keputusan && $keputusan !== 'Belum dapat diterima') {
                        $fail('Jika hasil tidak lulus, keputusan harus "Belum dapat diterima"');
                    }
                    if ($value === 'lulus' && $keputusan === 'Belum dapat diterima') {
                        $fail('Jika hasil lulus, keputusan tidak boleh "Belum dapat diterima"');
                    }
                }
            ],
            'nilaiAkhir' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
                function ($attribute, $value, $fail) {
                    $hasil = $this->input('hasil');
                    if ($hasil === 'lulus' && $value < 70) {
                        $fail('Nilai minimum kelulusan adalah 70');
                    }
                    if ($hasil === 'tidak lulus' && $value >= 70) {
                        $fail('Nilai di bawah 70 tidak dapat dinyatakan lulus');
                    }
                }
            ],
            'keputusan' => [
                'nullable',
                'exists:keputusan,id',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $jenisUjian = \App\Models\JenisUjian::find($this->jenisUjianId);
                        if (!in_array(strtolower($jenisUjian->nama_jenis), ['ujian hasil', 'ujian skripsi'])) {
                            $fail('Keputusan hanya bisa diisi untuk ujian hasil dan ujian skripsi.');
                        }
                    }
                }
            ],
            'catatan' => 'nullable|string',
        ];
    }

    public function prepareForValidation(): void
    {
        if($this->filled('jadwalUjian')) {
            $hariJadwal = strtolower(date('l', strtotime($this->input('jadwalUjian'))));
            $hariIndonesia = [
                'monday' => 'senin',
                'tuesday' => 'selasa',
                'wednesday' => 'rabu',
                'thursday' => 'kamis',
                'friday' => 'jumat',
                'saturday' => 'sabtu',
                'sunday' => 'minggu'
            ];
            $this->merge([
                'hariUjian' => $hariIndonesia[$hariJadwal],
            ]);
        }
        if($this->has('penguji') && is_array($this->penguji)) {
            $mappedPenguji = collect($this->input('penguji'))->map(function($item) {

                $roleMapped = [
                    'ketuaPenguji' => 'ketua_penguji',
                    'sekretarisPenguji' => 'sekretaris_penguji',
                    'penguji1' => 'penguji_1',
                    'penguji2' => 'penguji_2',
                ];

                return [
                    'dosen_id' => $item['dosen_id'] ?? $item['dosenId' ] ?? null,
                    'peran' => $roleMapped[$item['peran']] ?? $item['peran'] ?? null,
                ];
            })->toArray();

        }

        $this->merge([
            'pendaftaran_ujian_id' => $this->input('pendaftaranUjianId'),
            'mahasiswa_id' => $this->input('mahasiswaId'),
            'jenis_ujian_id' => $this->input('jenisUjianId'),
            'hari_ujian' => $this->input('hariUjian'),
            'jadwal_ujian' => $this->input('jadwalUjian'),
            'waktu_mulai' => $this->input('waktuMulai'),
            'waktu_selesai' => $this->input('waktuSelesai'),
            'ruangan_id' => $this->input('ruanganId'),
            'penguji' => $mappedPenguji ?? null,
            'nilai_akhir' => $this->input('nilaiAkhir'),
            'keputusan' => $this->input('keputusan'),
        ]);
    }

    //     public function withValidator($validator)
    // {
    //     $validator->after(function ($validator) {
    //         $penguji = collect([
    //             $this->ketua_penguji,
    //             $this->sekretaris_penguji,
    //             $this->penguji_1,
    //             $this->penguji_2,
    //         ])->filter()->values();

    //         if ($penguji->count() !== $penguji->unique()->count()) {
    //             $validator->errors()->add(
    //                 'penguji',
    //                 'Setiap dosen penguji harus berbeda (tidak boleh ada duplikat).'
    //             );
    //         }
    //     });
    // }

}
