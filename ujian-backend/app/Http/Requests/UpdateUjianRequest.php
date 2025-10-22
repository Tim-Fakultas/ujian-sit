<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'hariUjian' => 'sometimes|in:senin,selasa,rabu,kamis,jumat,sabtu,minggu',
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
            'ketuaPenguji' => [
                'sometimes', 'nullable', 'exists:dosen,id',
                'different:sekretarisPenguji', 'different:penguji1', 'different:penguji2'
            ],
            'sekretarisPenguji' => [
                'sometimes', 'nullable', 'exists:dosen,id',
                'different:ketuaPenguji', 'different:penguji1', 'different:penguji2'
            ],
            'penguji1' => [
                'sometimes', 'nullable', 'exists:dosen,id',
                'different:ketuaPenguji', 'different:sekretarisPenguji', 'different:penguji2'
            ],
            'penguji2' => [
                'sometimes', 'nullable', 'exists:dosen,id',
                'different:ketuaPenguji', 'different:sekretarisPenguji', 'different:penguji1'
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
            'keputusan' => [
                'sometimes', 'nullable',
                'in:Dapat diterima tanpa perbaikan,Dapat diterima dengan perbaikan kecil,Dapat diterima dengan perbaikan besar,Belum dapat diterima',
                function ($attribute, $value, $fail) {
                    // Hindari error jika relasi tidak dimuat
                    $jenisUjian = optional($this->ujian->jenisUjian)->nama_jenis;
                    if ($value && !in_array(strtolower($jenisUjian ?? ''), ['ujian hasil', 'ujian skripsi'])) {
                        $fail('Keputusan hanya bisa diisi untuk ujian hasil dan ujian skripsi.');
                    }
                },
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
                'monday' => 'senin',
                'tuesday' => 'selasa',
                'wednesday' => 'rabu',
                'thursday' => 'kamis',
                'friday' => 'jumat',
                'saturday' => 'sabtu',
                'sunday' => 'minggu',
            ];

            $this->merge([
                'hariUjian' => $hariIndonesia[$hariJadwal] ?? null,
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
            'nilai_akhir' => $this->input('nilaiAkhir'),
        ];

        // Hanya merge field yang terisi untuk menghindari overwrite null
        $this->merge(array_filter($mapped, fn($v) => $v !== null));
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Ambil semua nilai penguji dari request, atau dari data ujian lama
            $ujian = $this->route('ujian'); // dari Route Model Binding
            $penguji = collect([
                $this->input('ketuaPenguji') ?? $this->input('ketua_penguji') ?? $ujian->ketua_penguji,
                $this->input('sekretarisPenguji') ?? $this->input('sekretaris_penguji') ?? $ujian->sekretaris_penguji,
                $this->input('penguji1') ?? $this->input('penguji_1') ?? $ujian->penguji_1,
                $this->input('penguji2') ?? $this->input('penguji_2') ?? $ujian->penguji_2,
            ])->filter()->values();

            // Jika ada duplikat antar semua penguji (lama + baru)
            if ($penguji->count() !== $penguji->unique()->count()) {
                $validator->errors()->add(
                    'penguji',
                    'Setiap dosen penguji harus berbeda (tidak boleh ada duplikat).'
                );
            }
        });
    }

}
