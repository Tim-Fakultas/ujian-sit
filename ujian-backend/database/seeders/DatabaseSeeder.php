<?php

namespace Database\Seeders;

use App\Models\Bimbingan;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Mahasiswa;
use App\Models\Pejabat;
use App\Models\Pengajuan;
use App\Models\Prodi;
use App\Models\Skripsi;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        
        Fakultas::factory(1)
    ->has(
        Prodi::factory(3)
            ->has(
                Mahasiswa::factory(30)
                    ->has(
                        Pengajuan::factory(2)
                            ->has(
                                Skripsi::factory()
                                    ->has(Bimbingan::factory(2))
                            )
                    )
            )
            ->has(Dosen::factory(10))
    )
    ->create();

    }
}
