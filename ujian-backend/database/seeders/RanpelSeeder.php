<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Seeder;

class RanpelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranpelData =[
            [
                'judul_penelitian' => 'Penerapan Machine Learning untuk Prediksi Kelulusan Mahasiswa',
                'masalah_dan_penyebab' => 'Kurangnya sistem prediksi akademik yang efektif untuk mendeteksi mahasiswa berisiko tidak lulus tepat waktu.',
                'alternatif_solusi' => 'Mengembangkan model prediksi menggunakan algoritma Random Forest dan Logistic Regression.',
                'metode_penelitian' => 'Metode kuantitatif dengan pendekatan supervised learning berbasis data akademik historis.',
                'hasil_yang_diharapkan' => 'Terciptanya sistem prediksi yang membantu dosen wali memantau perkembangan mahasiswa.',
                'kebutuhan_data' => 'Data nilai mahasiswa, IPK, jumlah SKS, dan riwayat kehadiran.',
            ],
            [
                'judul_penelitian' => 'Implementasi Sistem Informasi Peminjaman Alat Laboratorium Berbasis Web',
                'masalah_dan_penyebab' => 'Proses peminjaman alat laboratorium masih manual dan sering menyebabkan kehilangan data.',
                'alternatif_solusi' => 'Membangun sistem informasi berbasis web dengan fitur autentikasi dan pelacakan alat.',
                'metode_penelitian' => 'Metode pengembangan perangkat lunak waterfall dengan PHP dan MySQL.',
                'hasil_yang_diharapkan' => 'Sistem terintegrasi yang mempermudah manajemen peminjaman alat laboratorium.',
                'kebutuhan_data' => 'Data mahasiswa, alat laboratorium, dan catatan peminjaman.',
            ],
            [
                'judul_penelitian' => 'Analisis Sentimen Pengguna terhadap Aplikasi E-Learning Menggunakan NLP',
                'masalah_dan_penyebab' => 'Belum ada analisis otomatis terhadap kepuasan pengguna e-learning di kampus.',
                'alternatif_solusi' => 'Menggunakan Natural Language Processing untuk mengklasifikasikan ulasan pengguna.',
                'metode_penelitian' => 'Metode analisis teks dengan algoritma Naive Bayes dan TF-IDF.',
                'hasil_yang_diharapkan' => 'Pemetaan sentimen positif dan negatif terhadap fitur aplikasi e-learning.',
                'kebutuhan_data' => 'Data komentar pengguna dari survei dan media sosial.',
            ],
            [
                'judul_penelitian' => 'Perancangan Aplikasi Mobile Absensi Mahasiswa Menggunakan QR Code',
                'masalah_dan_penyebab' => 'Proses absensi manual menyebabkan antrian panjang dan kesalahan pencatatan.',
                'alternatif_solusi' => 'Membangun aplikasi absensi dengan pemindaian QR Code menggunakan smartphone.',
                'metode_penelitian' => 'Metode prototyping dengan bahasa Dart dan framework Flutter.',
                'hasil_yang_diharapkan' => 'Sistem absensi yang cepat, akurat, dan hemat waktu.',
                'kebutuhan_data' => 'Data mahasiswa, jadwal kuliah, dan lokasi ruang kelas.',
            ],
            [
                'judul_penelitian' => 'Sistem Rekomendasi Pemilihan Topik Skripsi Menggunakan Algoritma K-Means',
                'masalah_dan_penyebab' => 'Mahasiswa sering kesulitan menentukan topik skripsi yang sesuai minat dan kemampuan.',
                'alternatif_solusi' => 'Menggunakan algoritma clustering K-Means untuk merekomendasikan topik berdasarkan profil mahasiswa.',
                'metode_penelitian' => 'Metode data mining dengan analisis clustering.',
                'hasil_yang_diharapkan' => 'Aplikasi rekomendasi topik skripsi yang personal dan adaptif.',
                'kebutuhan_data' => 'Data minat mahasiswa, nilai mata kuliah, dan bidang keahlian dosen.',
            ],
            [
                'judul_penelitian' => 'Rancang Bangun Sistem Informasi Pengajuan Surat Akademik Fakultas Sains dan Teknologi',
                'masalah_dan_penyebab' => 'Proses pengajuan surat akademik masih manual dan tidak terpantau dengan baik.',
                'alternatif_solusi' => 'Membangun sistem berbasis web dengan pelacakan status pengajuan.',
                'metode_penelitian' => 'Metode waterfall dengan framework Laravel dan MySQL.',
                'hasil_yang_diharapkan' => 'Digitalisasi proses surat-menyurat akademik yang lebih cepat dan transparan.',
                'kebutuhan_data' => 'Data mahasiswa, dosen, dan jenis surat akademik.',
            ],
            [
                'judul_penelitian' => 'Optimasi Jadwal Perkuliahan Menggunakan Algoritma Genetika',
                'masalah_dan_penyebab' => 'Penjadwalan kuliah sering bentrok antar kelas dan dosen.',
                'alternatif_solusi' => 'Menerapkan algoritma genetika untuk menghasilkan jadwal optimal.',
                'metode_penelitian' => 'Metode eksperimental berbasis simulasi dengan bahasa Python.',
                'hasil_yang_diharapkan' => 'Penjadwalan otomatis yang efisien tanpa bentrok waktu.',
                'kebutuhan_data' => 'Data dosen, mata kuliah, ruangan, dan waktu perkuliahan.',
            ],
            [
                'judul_penelitian' => 'Analisis Faktor yang Mempengaruhi Kepuasan Pengguna Sistem Informasi Akademik',
                'masalah_dan_penyebab' => 'Belum ada penelitian yang mengukur tingkat kepuasan terhadap sistem akademik.',
                'alternatif_solusi' => 'Melakukan survei dengan model Technology Acceptance Model (TAM).',
                'metode_penelitian' => 'Metode kuantitatif dengan kuesioner dan analisis regresi linier.',
                'hasil_yang_diharapkan' => 'Rekomendasi peningkatan fitur sistem informasi akademik.',
                'kebutuhan_data' => 'Data responden mahasiswa dan hasil survei kepuasan.',
            ],
            [
                'judul_penelitian' => 'Penerapan Blockchain untuk Transparansi Pengelolaan Dana Kegiatan Mahasiswa',
                'masalah_dan_penyebab' => 'Kurangnya transparansi dalam pengelolaan dana kegiatan mahasiswa.',
                'alternatif_solusi' => 'Menggunakan teknologi blockchain untuk mencatat transaksi secara publik dan terdesentralisasi.',
                'metode_penelitian' => 'Metode eksperimen dengan implementasi smart contract di Ethereum.',
                'hasil_yang_diharapkan' => 'Sistem transparan yang mencegah manipulasi data keuangan.',
                'kebutuhan_data' => 'Data transaksi keuangan dan struktur organisasi BEM.',
            ],
            [
                'judul_penelitian' => 'Pengembangan Sistem Monitoring Kinerja Dosen Menggunakan Dashboard Interaktif',
                'masalah_dan_penyebab' => 'Belum ada sistem terpusat untuk memantau kinerja dosen secara real-time.',
                'alternatif_solusi' => 'Membangun dashboard visualisasi data kinerja dosen menggunakan framework React dan Laravel.',
                'metode_penelitian' => 'Metode pengembangan agile dengan integrasi API RESTful.',
                'hasil_yang_diharapkan' => 'Dashboard interaktif yang menampilkan metrik kinerja dosen secara visual.',
                'kebutuhan_data' => 'Data kehadiran, publikasi ilmiah, dan evaluasi mahasiswa.',
            ],
        ];

        DB::table('ranpel')->insert($ranpelData);

    }
}
