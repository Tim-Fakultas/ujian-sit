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
            'ruangan' => 'required|string|max:255',
            'ketuaPenguji' => [
                'nullable',
                'exists:dosen,id',
                'different:sekretarisPenguji',
                'different:penguji1',
                'different:penguji2'
            ],
            'sekretarisPenguji' => [
                'nullable',
                'exists:dosen,id',
                'different:ketuaPenguji',
                'different:penguji1',
                'different:penguji2'
            ],
            'penguji1' => [
                'nullable',
                'exists:dosen,id',
                'different:ketuaPenguji',
                'different:sekretarisPenguji',
                'different:penguji2'
            ],
            'penguji2' => [
                'nullable',
                'exists:dosen,id',
                'different:ketuaPenguji',
                'different:sekretarisPenguji',
                'different:penguji1'
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
                'in:Dapat diterima tanpa perbaikan,Dapat diterima dengan perbaikan kecil,Dapat diterima dengan perbaikan besar,Belum dapat diterima',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $jenisUjian = \App\Models\JenisUjian::find($this->jenisUjianId);
                        if (!in_array(strtolower($jenisUjian->nama_jenis), ['ujian hasil', 'ujian skripsi'])) {
                            $fail('Keputusan hanya bisa diisi untuk ujian hasil dan ujian skripsi.');
                        }
                    }
                },
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
            'keputusan' => $this->input('keputusan'),
        ]);
    }
}
