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
        PengajuanJudul::factory(50)->create();

        // Create Judul (titles) - sebelum Ranpel
        \App\Models\Judul::factory(30)->create();

        // Create Ranpel (research plans) - harus sebelum Skripsi
        \App\Models\Ranpel::factory(25)->create();

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
