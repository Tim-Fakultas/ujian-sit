<?php

namespace Database\Seeders;

use App\Models\Syarat;
use App\Models\JenisUjian;
use Illuminate\Database\Seeder;

class SyaratSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure Jenis Ujian exists
        $proposal = JenisUjian::where('nama_jenis', 'Ujian Proposal')->first();
        $hasil = JenisUjian::where('nama_jenis', 'Ujian Hasil')->first();
        $skripsi = JenisUjian::where('nama_jenis', 'Ujian Skripsi')->first();

        if (!$proposal || !$hasil || !$skripsi) {
            $this->command->error('Jenis Ujian not found. Please run JenisUjianSeeder first.');
            return;
        }

        // Clear existing requirements to prevent duplicates logic if needed, 
        // or just use firstOrCreate. Here we'll truncate for clean slate if mostly static data.
        // Be careful with foreign keys in production, but for dev seeding it's often okay.
        // Syarat::truncate(); // Commented out to be safe, using create directly.

        Syarat::query()->delete(); // Safer than truncate for FK checks sometimes?

        $data = [
            'proposal' => [
                'id' => $proposal->id,
                'items' => [
                    'Bukti Lulus mata kuliah Metodologi Penelitian (minimal C)',
                    'SKS yang telah ditempuh minimal >= 100 sks',
                    'Transkrip nilai sementara yang dilegalisir',
                    'Formulir pengajuan judul dan pembimbing skripsi yang telah ditanda tangani Koordinator Skripsi dan Ketua Program Studi',
                    'Halaman pengesahan proposal skripsi yang di tanda tangani Pembimbing dan Ketua Program Studi',
                    'Surat Keterangan Lulus Cek Plagiat',
                    'File Proposal Skripsi Lengkap dengan format PDF dikirim ke email si@radenfatah.ac.id dengan nama file Nama-NIM-Proposal',
                    'Form Perbaikan Proposal untuk ujian ke-2, 3 dst.',
                ]
            ],
            'hasil' => [
                'id' => $hasil->id,
                'items' => [
                    'Bukti pembayaran SPP semester berjalan',
                    'KST yang tercantum Skripsi',
                    'Transkrip nilai sementara yang dilegalisir',
                    'Surat Keterangan Lulus Ujian Seminar Proposal',
                    'Bukti lulus ujian BTA (sertifikat BTA)',
                    'Bukti lulus TOEFL >= 400',
                'Bukti hafalan 10 surat Juz \'Amma',
                    'Ijazah SMA/MA',
                    'Sertifikat KKN',
                    'Bukti hadir dalam seminar proposal',
                    'Halaman Pengesahan Skripsi untuk ujian hasil yang ditanda tangani Pembimbing dan Ketua Program Stud',
                    'Formulir Mengikuti Ujian Hasil',
                    'Surat Keterangan Lulus Cek Plagiat',
                    'File Hasil Skripsi Lengkap dengan format PDF dikirim ke email si@radenfatah.ac.id dengan nama file Nama-NIM-Hasil',
                    'Formulir Perbaikan Proposal Skripsi',
                    'Form Perbaikan Hasil untuk ujian ke-2, 3 dst.',
                ]
            ],
            'skripsi' => [
                'id' => $skripsi->id,
                'items' => [
                    'Skripsi yang di ACC Pembimbing I dan II',
                    'Surat Kelengkapan Berkas Yang Telah Ditanda tangani oleh Ka. Prodi / Sek. Prodi',
                    'Surat Rekapitulasi Nilai Ujian Komprehensif',
                    'Surat Ket. Perubahan Judul (Jika Berubah)',
                    'Surat Izin Penelitian',
                    'KTM',
                    'Bukti pembayaran SPP semester berjalan',
                    'Transkrip nilai sementara yang dilegalisir',
                    'Surat Keterangan Lulus Ujian Seminar Proposal',
                    'Bukti lulus ujian BTA (sertifikat BTA)',
                    'Sertifikat KKN',
                    'Formulir Mengikuti Ujian Skripsi',
                    'Surat Keterangan Lulus Ujian Hasil',
                    'Surat Keterangan Lulus Cek Plagiat',
                    'Bukti mengirim (Submit) jurnal ilmiah',
                    'Sertifikat OSPEK',
                    'Halaman Pengesahan Skripsi yang ditanda tangani oleh Pembimbing dan ketua Program Studi',
                    'File Skripsi Lengkap dengan format PDF dikirim ke email si@radenfatah.ac.id dengan nama file Nama-NIM-Skripsi',
                    'Formulir Perbaikan Hasil Skripsi',
                    'Form Perbaikan Skripsi untuk ujian ke-2, 3 dst.',
                ]
            ]
        ];

        foreach ($data as $key => $group) {
            foreach ($group['items'] as $item) {
                // Determine Category
                $kategori = 'administratif';
                $lowerItem = strtolower($item);
                if (
                    str_contains($lowerItem, 'lulus') ||
                    str_contains($lowerItem, 'nilai') ||
                    str_contains($lowerItem, 'sks') ||
                    str_contains($lowerItem, 'kst') ||
                    str_contains($lowerItem, 'transkrip') ||
                    str_contains($lowerItem, 'ijazah') ||
                    str_contains($lowerItem, 'hafalan') ||
                    str_contains($lowerItem, 'toefl') ||
                    str_contains($lowerItem, 'ujian komprehensif')
                ) {
                    $kategori = 'akademik';
                } elseif (str_contains($lowerItem, 'acc') || str_contains($lowerItem, 'pembimbing')) {
                    $kategori = 'bimbingan';
                }

                // Determine Obligatory (Wajib)
                // If it mentions "Jaka Berubah" or "untuk ujian ke-2", it's likely not mandatory for everyone
                $wajib = true;
                if (str_contains($lowerItem, 'perbaikan') || str_contains($lowerItem, 'jika berubah')) {
                    $wajib = false;
                }

                Syarat::create([
                    'jenis_ujian_id' => $group['id'],
                    'nama_syarat' => $item,
                    'kategori' => $kategori,
                    'wajib' => $wajib,
                ]);
            }
        }
    }
}
