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
        $komponenProposal = [
            [
                //1
                'jenis_ujian_id' => 1,
                'nama_komponen' => 'Efektivitas Pendahuluan',
                'deskripsi' => 'Ketajaman perumusan masalah, Tujuan Penelitian, Kebaharuan dan originalitas penelitian, Kesesuaian tema/judul dengan isi',
                'bobot' => 20,
            ],
            [
                //2
                'jenis_ujian_id' => 1,
                'nama_komponen' => 'Motivasi pada Penelitian',
                'deskripsi' => 'Pengembangan IPTEK Pembangunan atau pengembangan Kelembagaan',
                'bobot' => 15,
            ],
            [
                //3
                'jenis_ujian_id' => 1,
                'nama_komponen' => 'Literatur review',
                'deskripsi' => 'Referensi Jurnal (70%) Kedalaman Tinjauan Pustaka buku (30%)',
                'bobot' => 15,
            ],
            [
                //4
                'jenis_ujian_id' => 1,
                'nama_komponen' => 'Metodologi',
                'deskripsi' => 'Ketepatan Desain & Instrumen Ketepatan Analisis Data Relevansi Kejelasan Isi Konten',
                'bobot' => 15,
            ],
            [
                //5
                'jenis_ujian_id' => 1,
                'nama_komponen' => 'Sikap/Presentasi_1',
                'deskripsi' => 'Sistematis & Logis dan daya nalar saat menjawab, Kepercayaan diri saat berbicara',
                'bobot' => 20,
            ],
            [
                //6
                'jenis_ujian_id' => 1,
                'nama_komponen' => 'Sikap/Presentasi_2',
                'deskripsi' => 'Sistematis & Logis dan daya nalar saat menjawab, Kepercayaan diri saat berbicara',
                'bobot' => 35,
            ],
            [
                //7
                'jenis_ujian_id' => 1,
                'nama_komponen' => 'Bimbingan',
                'deskripsi' => '',
                'bobot' => 15,
            ],
        ];

        $komponenHasil = [
            [
                //1
                'jenis_ujian_id' => 2,
                'nama_komponen' => 'Efektivitas Pendahuluan',
                'deskripsi' => 'Ketajaman perumusan masalah, Tujuan Penelitian, Kebaharuan dan originalitas penelitian, Kesesuaian tema/judul dengan isi',
                'bobot' => 15,
            ],
            [
                //2
                'jenis_ujian_id' => 2,
                'nama_komponen' => 'Motivasi pada Penelitian',
                'deskripsi' => 'Pengembangan IPTEK, Pembangunan atau pengembangan Kelembagaan',
                'bobot' => 20,
            ],
            [
                //3
                'jenis_ujian_id' => 2,
                'nama_komponen' => 'Literatur Review',
                'deskripsi' => 'Referensi Jurnal, Kedalaman Tinjauan Pustaka buku',
                'bobot' => 15,
            ],
            [
                //4
                'jenis_ujian_id' => 2,
                'nama_komponen' => 'Metodologi dan Konteks Teknis',
                'deskripsi' => 'Ketepatan Desain & Instrumen, Ketepatan Analisis Data, Relevansi Kejelasan Isi Konten',
                'bobot' => 15,
            ],
            [
                //5
                'jenis_ujian_id' => 2,
                'nama_komponen' => 'Efektivitas Pengambilan Kesimpulan dan Saran',
                'deskripsi' => 'Bersifat logis sesuai dengan Hasil temuan penelitian dan mampu menyimpulkan penelitian dengan baik sesuai dengan tujuan penelitian',
                'bobot' => 15,
            ],
            [
                //6
                'jenis_ujian_id' => 2,
                'nama_komponen' => 'Sikap/Presentasi_1',
                'deskripsi' => 'Sistematis & Logis dan daya nalar saat menjawab, Kepercayaan diri saat berbicara',
                'bobot' => 10,
            ],
            [
                //7
                'jenis_ujian_id' => 2,
                'nama_komponen' => 'Sikap/Presentasi_2',
                'deskripsi' => 'Sistematis & Logis dan daya nalar saat menjawab, Kepercayaan diri saat berbicara',
                'bobot' => 20,
            ],
            [
                //8
                'jenis_ujian_id' => 2,
                'nama_komponen' => 'Bimbingan',
                'deskripsi' => '',
                'bobot' => 10,
            ]
        ];

        $komponenSkripsi = [
            [
                //1
                'jenis_ujian_id' => 3,
                'nama_komponen' => 'Efektivitas Pendahuluan',
                'deskripsi' => 'Ketajaman perumusan masalah, Tujuan Penelitian, Kebaharuan dan originalitas penelitian Kesesuaian tema/judul dengan isi',
                'bobot' => 10,
            ],
            [
                //2
                'jenis_ujian_id' => 3,
                'nama_komponen' => 'Motivasi pada Penelitian',
                'deskripsi' => 'Pengembangan IPTEK, Pembangunan atau pengembangan Kelembagaan, Ada Perubahan paradigma berpikir dari konten keilmuan secara kontekstual',
                'bobot' => 20,
            ],
            [
                //3
                'jenis_ujian_id' => 3,
                'nama_komponen' => 'Literatur Review',
                'deskripsi' => 'Referensi Jurnal, Kedalaman Tinjauan Pustaka',
                'bobot' => 15,
            ],
            [
                //4
                'jenis_ujian_id' => 3,
                'nama_komponen' => 'Metodologi dan Konteks Teknis',
                'deskripsi' => 'Ketepatan Desain & Instrumen, Ketepatan Analisis Data, Relevansi Kejelasan Isi Konten',
                'bobot' => 15,
            ],
            [
                //5
                'jenis_ujian_id' => 3,
                'nama_komponen' => 'Efektivitas Pengambilan Kesimpulan dan Saran',
                'deskripsi' => 'Bersifat logis dan sistematis sesuai dengan Hasil penelitian Kesimpulan sesuai dengan tujuan penelitian Saran dan tindak lanjut yang realistik',
                'bobot' => 20,
            ],
            [
                //6
                'jenis_ujian_id' => 3,
                'nama_komponen' => 'Sikap/Presentasi_1',
                'deskripsi' => 'Mampu mempertahankan secara Sistematis & Logis saat menjawab, Kepercayaan diri saat berbicara',
                'bobot' => 10,
            ],
            [
                //7
                'jenis_ujian_id' => 3,
                'nama_komponen' => 'Sikap/Presentasi_2',
                'deskripsi' => 'Mampu mempertahankan secara Sistematis & Logis saat menjawab, Kepercayaan diri saat berbicara',
                'bobot' => 20,
            ],
            [
                //8
                'jenis_ujian_id' => 3,
                'nama_komponen' => 'Bimbingan',
                'deskripsi' => '',
                'bobot' => 10,
            ]
        ];

        $allkomponen = array_merge($komponenProposal, $komponenHasil, $komponenSkripsi);

        KomponenPenilaian::factory()->createMany($allkomponen);

    }
}
