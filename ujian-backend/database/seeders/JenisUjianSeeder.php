<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class JenisUjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenisUjian = [
            ['nama_jenis' => 'Ujian Proposal'],
            ['nama_jenis' => 'Ujian Hasil'],
            ['nama_jenis' => 'Ujian Skripsi'],
        ];
        \App\Models\JenisUjian::insert($jenisUjian);

        
    }
}
