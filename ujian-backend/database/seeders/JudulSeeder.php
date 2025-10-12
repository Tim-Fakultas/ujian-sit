<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class JudulSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Judul::factory()->createMany([
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

        // Additional random judul
        \App\Models\Judul::factory(10)->create();
    }
}
