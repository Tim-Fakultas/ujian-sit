<?php

namespace Database\Seeders;

use App\Models\Bimbingan;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Mahasiswa;
use App\Models\Pejabat;
use App\Models\PengajuanJudul;
use App\Models\Prodi;
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

        

 Fakultas::factory(1)
->has(
    Prodi::factory(3)
        ->has(Dosen::factory(10))   // <-- buat dosen dulu, per prodi
        ->has(
            Mahasiswa::factory(30)
                ->has(
                    PengajuanJudul::factory(2)
                        ->has(
                            Skripsi::factory()
                                ->has(Bimbingan::factory(2))
                        )
                )
        )
)
->create();


    Pejabat::factory(3)->create();

    }
}
