<?php

namespace Database\Seeders;

use App\Models\KomponenPenilaian;
use Illuminate\Database\Seeder;

class KomponenPenilaianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $komponen = [
            [
                'nama_komponen' => 'Efektivitas Pendahuluan',
                'deskripsi' => 'Ketajaman perumusan masalah, Tujuan Penelitian, Kebaharuan dan originalitas penelitian, Kesesuaian tema/judul dengan isi',
                'bobot' => 15,
            ],
            [
                'nama_komponen' => 'Motivasi pada Penelitian',
                'deskripsi' => 'Pengembangan IPTEK Pembangunan atau pengembangan Kelembagaan',
                'bobot' => 30,
            ],
            [
                'nama_komponen' => 'Literatur review',
                'deskripsi' => 'Referensi Jurnal, Kedalaman Tinjauan Pustaka buku',
                'bobot' => 15,
            ],
            [
                'nama_komponen' => 'Metodologi dan Konten Teknis',
                'deskripsi' => 'Ketepatan Desain & Instrumen Ketepatan Analisis Data Relevansi Kejelasan Isi Konten',
                'bobot' => 15,
            ],
            [
                'nama_komponen' => 'Efektivitas Pengambilan Kesimpulan dan Saran',
                'deskripsi' => 'Bersifat logis sesuai dengan Hasil temuan penelitian dan mampu menyimpulkan penelitian dengan baik sesuai dengan tujuan penelitian',
                'bobot' => 15,
            ],
            [
                'nama_komponen' => 'Sikap/Presentasi',
                'deskripsi' => 'Sistematis & Logis dan daya nalar saat menjawab, Kepercayaan diri saat berbicara',
                'bobot' => 10,
            ],
            [
                'nama_komponen' => 'Bimbingan',
                'deskripsi' => '',
                'bobot' => 10,
            ],
        ];

        KomponenPenilaian::factory()->createMany($komponen);

    }
}
