<?php

namespace Database\Seeders;

use App\Models\Bimbingan;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Judul;
use App\Models\Mahasiswa;
use App\Models\Pejabat;
use App\Models\PengajuanJudul;
use App\Models\Prodi;
use App\Models\Ranpel;
use App\Models\Skripsi;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
                'nip_nim' => '2120803026',
                'nama' => 'Muhammad Aldo Saputra',
                'email' => 'aldo@example.com',
                'password' => bcrypt('2120803026'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
        ]);

        // Step 1: Create 1 Fakultas
        $fakultas = Fakultas::factory()->create([
            'nama_fakultas' => 'Fakultas Sains dan Teknologi'
        ]);

        // Step 2: Create 3 Prodi for the fakultas
        $prodi1 = Prodi::factory()->create([
            'nama_prodi' => 'Sistem Informasi',
            'fakultas_id' => $fakultas->id
        ]);

        $prodi2 = Prodi::factory()->create([
            'nama_prodi' => 'Biologi',
            'fakultas_id' => $fakultas->id
        ]);

        $prodi3 = Prodi::factory()->create([
            'nama_prodi' => 'Kimia',
            'fakultas_id' => $fakultas->id
        ]);

        // Step 3: Create 6 Dosen for each prodi (18 total)
        Dosen::factory(6)->create(['prodi_id' => $prodi1->id]);
        Dosen::factory(6)->create(['prodi_id' => $prodi2->id]);
        Dosen::factory(6)->create(['prodi_id' => $prodi3->id]);

        // Step 4: Create 30 Mahasiswa for each prodi (90 total)
        Mahasiswa::factory(30)->create(['prodi_id' => $prodi1->id]);
        Mahasiswa::factory(30)->create(['prodi_id' => $prodi2->id]);
        Mahasiswa::factory(30)->create(['prodi_id' => $prodi3->id]);

        // Step 5: Create supporting data
        // Create some JenisUjian (types of exams)
        \App\Models\JenisUjian::factory(5)->create();

        // Create some Syarat (requirements)
        \App\Models\Syarat::factory(10)->create();

        // Step 6: Create related data using the factories
        // Create some PengajuanJudul (thesis proposals)
        PengajuanJudul::factory()->create([
            'mahasiswa_id' => 1,
            'judul' => 'Analisis Performa Algoritma Machine Learning pada Dataset Besar',
            'deskripsi' => 'Penelitian ini bertujuan untuk menganalisis performa beberapa algoritma machine learning dalam memproses dataset besar.',
            'tanggal_pengajuan' => '2023-09-15',
            'tanggal_disetujui' => '2023-09-22',
            'status' => 'disetujui',
            'dosen_id' => 3,
            'keterangan' => 'Judul relevan dengan bidang ilmu komputer.'
        ]);

        PengajuanJudul::factory()->create([
            'mahasiswa_id' => 2,
            'judul' => 'Pengembangan Aplikasi Mobile Berbasis Augmented Reality untuk Pendidikan',
            'deskripsi' => 'Membuat aplikasi mobile yang mengintegrasikan teknologi augmented reality untuk meningkatkan metode belajar.',
            'tanggal_pengajuan' => '2023-09-18',
            'tanggal_disetujui' => null,
            'status' => 'menunggu',
            'dosen_id' => 7,
            'keterangan' => null
        ]);

        PengajuanJudul::factory()->create([
            'mahasiswa_id' => 3,
            'judul' => 'Studi Kasus: Implementasi Internet of Things pada Sistem Monitoring Lingkungan',
            'deskripsi' => 'Menerapkan IoT untuk monitoring parameter lingkungan seperti suhu, kelembaban, dan kualitas udara.',
            'tanggal_pengajuan' => '2023-09-10',
            'tanggal_disetujui' => '2023-09-17',
            'status' => 'disetujui',
            'dosen_id' => 2,
            'keterangan' => 'Perlu penyesuaian metodologi penelitian.'
        ]);

        PengajuanJudul::factory()->create([
            'mahasiswa_id' => 4,
            'judul' => 'Optimalisasi Route Planning dengan Metode Metaheuristic',
            'deskripsi' => 'Mengimplementasikan algoritma metaheuristic untuk menyelesaikan masalah route planning dengan efisiensi maksimal.',
            'tanggal_pengajuan' => '2023-09-20',
            'tanggal_disetujui' => null,
            'status' => 'ditolak',
            'dosen_id' => 9,
            'keterangan' => 'Judul terlalu umum, perlu fokus pada area spesifik.'
        ]);

        PengajuanJudul::factory()->create([
            'mahasiswa_id' => 5,
            'judul' => 'Analisis Sentiment pada Media Sosial terhadap Produk Teknologi Terbaru',
            'deskripsi' => 'Menganalisis sentimen publik terhadap produk teknologi baru menggunakan teknik natural language processing.',
            'tanggal_pengajuan' => '2023-09-12',
            'tanggal_disetujui' => '2023-09-25',
            'status' => 'disetujui',
            'dosen_id' => 5,
            'keterangan' => null
        ]);

        PengajuanJudul::factory()->create([
            'mahasiswa_id' => 6,
            'judul' => 'Pengembangan Sistem Rekomendasi Berbasis Collaborative Filtering',
            'deskripsi' => 'Membangun sistem rekomendasi produk menggunakan teknik collaborative filtering untuk meningkatkan pengalaman pengguna.',
            'tanggal_pengajuan' => '2023-09-14',
            'tanggal_disetujui' => null,
            'status' => 'menunggu',
            'dosen_id' => 11,
            'keterangan' => null
        ]);

        PengajuanJudul::factory()->create([
            'mahasiswa_id' => 7,
            'judul' => 'Implementasi Blockchain untuk Keamanan Data Transaksi',
            'deskripsi' => 'Menerapkan teknologi blockchain untuk meningkatkan keamanan dan transparansi dalam transaksi digital.',
            'tanggal_pengajuan' => '2023-09-16',
            'tanggal_disetujui' => '2023-09-23',
            'status' => 'disetujui',
            'dosen_id' => 14,
            'keterangan' => 'Perlu penjelasan lebih rinci tentang aspek teknis.'
        ]);

        // Create additional PengajuanJudul using factory

        // Create Judul (titles) - sebelum Ranpel
        Judul::factory()->createMany([
            [
                'judul' => 'Analisis Performa Algoritma Machine Learning pada Dataset Besar',
                'deskripsi' => 'Penelitian ini bertujuan untuk menganalisis performa beberapa algoritma machine learning dalam memproses dataset besar.',
            ],
            [
                'judul' => 'Studi Kasus: Implementasi Internet of Things pada Sistem Monitoring Lingkungan',
                'deskripsi' => 'Menerapkan IoT untuk monitoring parameter lingkungan seperti suhu, kelembaban, dan kualitas udara.',
            ],
            [
                'judul' => 'Analisis Sentiment pada Media Sosial terhadap Produk Teknologi Terbaru',
                'deskripsi' => 'Menganalisis sentimen publik terhadap produk teknologi baru menggunakan teknik natural language processing.',
            ],
            [
                'judul' => 'Implementasi Blockchain untuk Keamanan Data Transaksi',
                'deskripsi' => 'Menerapkan teknologi blockchain untuk meningkatkan keamanan dan transparansi dalam transaksi digital.',
            ],
        ]);

        // Create Ranpel (research plans) - harus sebelum Skripsi
       // Membuat 4 data ranpel berdasarkan judul yang ada
 $ranpelData = [
    [
        'judul_id' => 1, // ID judul pertama
        'identifikasi_masalah' => 'Algoritma machine learning tradisional sering mengalami kendala dalam memproses dataset besar, menyebabkan waktu komputasi tinggi dan akurasi rendah.',
        'rumusan_masalah' => 'Bagaimana cara mengoptimalkan performa beberapa algoritma machine learning dalam memproses dataset besar dengan efisiensi tinggi?',
        'penelitian_sebelumnya' => 'Penelitian sebelumnya menunjukkan bahwa algoritma Random Forest dan SVM memiliki performa baik pada dataset medium, namun masih belum optimal untuk dataset besar (>1GB).',
        'pokok_masalah' => 'Optimalisasi performa algoritma machine learning pada dataset besar dengan trade-off antara akurasi dan waktu komputasi.',
        'deskripsi_lengkap' => 'Penelitian ini akan membandingkan performa algoritma Random Forest, SVM, dan Neural Network pada dataset besar. Metode optimasi seperti parallel computing dan feature selection akan digunakan untuk meningkatkan efisiensi. Dataset yang digunakan merupakan dataset publik dari Kaggle dengan ukuran >1GB.',
        'status' => 'ditolak'
    ],
    [
        'judul_id' => 2, // ID judul kedua
        'identifikasi_masalah' => 'Sistem monitoring lingkungan konvensional masih bergantung pada infrastruktur kabel dan memiliki keterbatasan dalam cakupan area serta real-time monitoring.',
        'rumusan_masalah' => 'Bagaimana menerapkan sistem IoT yang terintegrasi dengan sensor-sensor modern untuk memonitoring parameter lingkungan secara real-time dan hemat biaya?',
        'penelitian_sebelumnya' => 'Beberapa penelitian telah berhasil mengimplementasikan IoT untuk monitoring lingkungan, namun mayoritas masih menggunakan protokol komunikasi yang kurang efisien dan sistem manajemen data yang belum optimal.',
        'pokok_masalah' => 'Pengembangan sistem IoT holistik dengan protokol komunikasi efisien dan arsitektur cloud yang handal untuk analisis data real-time.',
        'deskripsi_lengkap' => 'Penelitian ini akan membangun sistem IoT dengan sensor-sensor untuk memonitoring suhu, kelembaban, dan kualitas udara. Data akan dikumpulkan menggunakan protokol MQTT dan dianalisis menggunakan dashboard real-time. Sistem akan diuji di area perkotaan dengan variasi kondisi lingkungan.',
        'status' => 'menunggu'
    ],
    [
        'judul_id' => 3, // ID judul ketiga
        'identifikasi_masalah' => 'Analisis sentimen pada media sosial terhadap produk teknologi baru seringkali tidak akurat karena tantangan dalam memahami konteks dan bahasa informal.',
        'rumusan_masalah' => 'Bagaimana meningkatkan akurasi analisis sentimen pada media sosial dengan menggabungkan teknik NLP dan deep learning untuk memahami konteks dan slang?',
        'penelitian_sebelumnya' => 'Metode klasifikasi tradisional seperti Naive Bayes dan LSTM telah digunakan untuk analisis sentimen, namun masih kesulitan dalam menangani konteks dan bahasa gaul.',
        'pokok_masalah' => 'Peningkatan akurasi analisis sentimen pada media sosial dengan mempertimbangkan faktor konteks dan bahasa informal.',
        'deskripsi_lengkap' => 'Penelitian ini akan mengembangkan model hybrid yang menggabungkan transformer-based model (BERT) dengan teknik NLP tradisional. Model akan dilatih menggunakan dataset tweet dan ulasan produk teknologi baru. Evaluasi akan dilakukan dengan membandingkan akurasi model dengan metode konvensional.',
        'status' => 'disetujui'
    ],
    [
        'judul_id' => 4, // ID judul keempat
        'identifikasi_masalah' => 'Transaksi digital saat ini masih rentan terhadap risiko keamanan seperti manipulasi data dan penipuan identitas.',
        'rumusan_masalah' => 'Bagaimana menerapkan teknologi blockchain untuk meningkatkan keamanan dan transparansi dalam transaksi digital dengan meminimalkan risiko篡改 (manipulasi)?',
        'penelitian_sebelumnya' => 'Blockchain telah terbukti efektif untuk keamanan data, namun implementasinya pada skenario transaksi massal masih menghadapi kendala skalabilitas dan integrasi dengan sistem legacy.',
        'pokok_masalah' => 'Implementasi blockchain dalam sistem transaksi digital dengan fokus pada skalabilitas dan integrasi sistem.',
        'deskripsi_lengkap' => 'Penelitian ini akan mengembangkan arsitektur blockchain yang dioptimalkan untuk transaksi digital. Platform akan menggunakan konsensus Proof-of-Stake dan smart contract untuk otomatisasi proses. Uji coba akan dilakukan pada simulasi transaksi e-commerce dan fintech dengan membandingkan performa dengan sistem tradisional.',
        'status' => 'menunggu'
    ]
];

    Ranpel::factory()->createMany($ranpelData);

        // Create some Skripsi based on approved proposals - setelah Ranpel dibuat
        Skripsi::factory(30)->create();

        // Create some PendaftaranUjian (exam registrations)
        \App\Models\PendaftaranUjian::factory(25)->create();

        // Create some Ujian (exams)
        \App\Models\Ujian::factory(20)->create();

        // Create Bimbingan (supervisions)
        Bimbingan::factory(40)->create();

        // Create JadwalPenguji (examiner schedules)
        \App\Models\JadwalPenguji::factory(30)->create();

        // Create KomponenPenilaian (assessment components)
        \App\Models\KomponenPenilaian::factory(15)->create();

        // Create Penilaian (assessments)
        \App\Models\Penilaian::factory(35)->create();

        // Create Templates
        \App\Models\Template::factory(8)->create();

        // Create PemenuhanSyarat (requirement fulfillments)
        \App\Models\PemenuhanSyarat::factory(60)->create();

        // Create some Pejabat (officials)
        Pejabat::factory(3)->create();



//  Fakultas::factory(1)
// ->has(
//     Prodi::factory(3)
//         ->has(Dosen::factory(10))   // <-- buat dosen dulu, per prodi
//         ->has(
//             Mahasiswa::factory(30)
//                 ->has(
//                     PengajuanJudul::factory(2)
//                         ->has(
//                             Skripsi::factory()
//                                 ->has(Bimbingan::factory(2))
//                         )
//                 )
//         )
// )
// ->create();


//     Pejabat::factory(3)->create();


    }
}
