<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Peminatan;

class PeminatanSeeder extends Seeder
{
    public function run(): void
    {
        Peminatan::factory()->createMany([
            [
                'nama_peminatan' => 'Pengembangan Sistem Informasi',
                'prodi_id' => 1,
            ], [
                'nama_peminatan' => 'Sistem Analis',
                'prodi_id' => 1,
            ], [
                'nama_peminatan' => 'Data Analis',
                'prodi_id' => 1,
            ], [
                'nama_peminatan' => 'Mikrobiologi',
                'prodi_id' => 2,
            ], [
                'nama_peminatan' => 'Kimia Analitik',
                'prodi_id' => 3,
            ],
        ]);
    }
}

