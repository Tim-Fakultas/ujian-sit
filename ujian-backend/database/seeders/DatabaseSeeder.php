<?php

namespace Database\Seeders;

use App\Models\Bimbingan;
use App\Models\Dosen;
use App\Models\Fakultas;
use App\Models\Judul;
use App\Models\Mahasiswa;
use App\Models\Pejabat;
use App\Models\Peminatan;
use App\Models\PengajuanJudul;
use App\Models\Prodi;
use App\Models\Ranpel;
use App\Models\Skripsi;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Artisan;
use Exception;
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
        // Step 1: Create 1 Fakultas
        $fakultas = Fakultas::factory()->create([
            'nama_fakultas' => 'Fakultas Sains dan Teknologi'
        ]);

        // Step 2: Create 3 Prod



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

        // Step 0: Create roles and permissions first
        $this->call(RolesAndPermissionsSeeder::class);

        $adminUser = User::factory()->create([
                'id' => 1,
                'nip_nim' => '1',
                'nama' => 'Muhammad Adib Saputra',
                'email' => 'Abdi@example.com',
                'password' => bcrypt('1'),
                'prodi_id'=> null,
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
        ]);

        // $dosenSI = User::factory()->create([
        //         'id' => 2,
        //         'nip_nim' => 'Freddy1987654321',
        //         'nama' => 'Freddy Kurnia Wijaya',
        //         'email' => 'freddykurnia@gmail.com',
        //         'password' => bcrypt('Freddy1987654321'),
        //         'prodi_id'=> $prodi1->id,
        //         'email_verified_at' => now(),
        //         'remember_token' => Str::random(10),
        // ]);

        // $dosenBiologi = User::factory()->create([
        //         'id' => 3,
        //         'nip_nim' => 'Dimas12345',
        //         'nama' => 'Dimas Prasetyo',
        //         'email' => 'dimas@gmail.com',
        //         'password' => bcrypt('Dimas12345'),
        //         'prodi_id'=> $prodi2->id,
        //         'email_verified_at' => now(),
        //         'remember_token' => Str::random(10),
        // ]);
        // $dosenKimia = User::factory()->create([
        //         'id' => 4,
        //         'nip_nim' => 'Farhan12345',
        //         'nama' => 'Farahan Pratama',
        //         'email' => 'farhan@gmail.com',
        //         'password' => bcrypt('Farhan12345'),
        //         'prodi_id'=> $prodi3->id,
        //         'email_verified_at' => now(),
        //         'remember_token' => Str::random(10),
        // ]);

        // $mahasiswaSI = User::factory()->create([
        //         'id' => 5,
        //         'nip_nim' => '23041450085',
        //         'nama' => 'Muhammad Luqman Al-Fauzan',
        //         'email' => '23041450085@radenfatah.ac.id',
        //         'password' => bcrypt('23041450085'),
        //         'prodi_id'=> $prodi1->id,
        //         'email_verified_at' => now(),
        //         'remember_token' => Str::random(10),
        // ]);
        // $mahasiswaBiologi = User::factory()->create([
        //         'id' => 6,
        //         'nip_nim' => '23041450086',
        //         'nama' => 'Farah Hasywaza Audremayna',
        //         'email' => '23041450086@radenfatah.ac.id',
        //         'password' => bcrypt('23041450086'),
        //         'prodi_id'=> $prodi2->id,
        //         'email_verified_at' => now(),
        //         'remember_token' => Str::random(10),
        // ]);
        // $mahasiswaKimia = User::factory()->create([
        //         'id' => 7,
        //         'nip_nim' => '23041450087',
        //         'nama' => 'Rizki Faruli',
        //         'email' => '23041450087@radenfatah.ac.id',
        //         'password' => bcrypt('23041450087'),
        //         'prodi_id'=> $prodi3->id,
        //         'email_verified_at' => now(),
        //         'remember_token' => Str::random(10),
        // ]);

        $kaprodi = User::factory()->create([
                'id' => 9,
                'nip_nim' => 'Kaprodi12345',
                'nama' => 'Kaprodi, M.Kom',
                'email' => 'kaprodi@radenfatah.ac.id',
                'password' => bcrypt('Kaprodi12345'),
                'prodi_id' => 1,
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
        ]);

        $sekprodi = User::factory()->create([
                'id' => 10,
                'nip_nim' => 'Sekprodi12345',
                'nama' => 'Sekprodi, M.Kom',
                'email' => 'sekprodi@radenfatah.ac.id',
                'password' => bcrypt('Sekprodi12345'),
                'prodi_id' => 1,
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
        ]);

        $adminProdiSI = User::factory()->create([
                'id' => 11,
                'nip_nim' => 'AdminSI',
                'nama' => 'Admin Prodi Sistem Informasi',
                'email' => 'adminsi@radenfatah.ac.id',
                'password' => bcrypt('AdminSI'),
                'prodi_id' => 1,
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
        ]);

        $adminProdiBiologi = User::factory()->create([
                'id' => 12,
                'nip_nim' => 'AdminBio12345',
                'nama' => 'Admin Prodi Biologi',
                'email' => 'biologi@radenfatah.ac.id',
                'password' => bcrypt('AdminBio12345'),
                'prodi_id' => 2,
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
        ]);

        $adminProdiKimia = User::factory()->create([
                'id' => 13,
                'nip_nim' => 'AdminKimia123',
                'nama' => 'Admin Prodi Kimia',
                'email' => 'AdminKimia123@radenfatah.ac.id',
                'password' => bcrypt('AdminKimia123'),
                'prodi_id' => 3,
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
        ]);
          // Assign admin role to the created user
        $adminUser->assignRole('super admin');
        // $dosenSI->assignRole('dosen');
        // $dosenBiologi->assignRole('dosen');
        // $dosenKimia->assignRole('dosen');
        // $mahasiswaSI->assignRole('mahasiswa');
        // $mahasiswaBiologi->assignRole('mahasiswa');
        // $mahasiswaKimia->assignRole('mahasiswa');
        $adminProdiSI->assignRole('admin prodi');
        $adminProdiBiologi->assignRole('admin prodi');
        $adminProdiKimia->assignRole('admin prodi');
        $sekprodi->assignRole('sekprodi');
        $kaprodi->assignRole('kaprodi');




        $peminatan = Peminatan::factory()->createMany([
            // Peminatan untuk Sistem Informasi
            [
                'nama_peminatan' => 'Pengembangan Sistem Informasi',
                'prodi_id' => $prodi1->id
            ],[
                'nama_peminatan' => 'Sistem Analis',
                'prodi_id' => $prodi1->id
            ],[
                'nama_peminatan' => 'Data Analis',
                'prodi_id' => $prodi1->id
            ],
            // Peminatan untuk Biologi
            [
                'nama_peminatan' => 'Mikrobiologi',
                'prodi_id' => $prodi2->id
            ],
            // Peminatan untuk Kimia
            [
                'nama_peminatan' => 'Kimia Analitik',
                'prodi_id' => $prodi3->id
            ]
        ]);

        // // Create Mahasiswa records for the test users
        // Mahasiswa::create([
        //     'nim' => '23041450085',
        //     'nama' => 'Muhammad Luqman Al-Fauzan',
        //     'no_hp' => '081234567890',
        //     'alamat' => 'Palembang',
        //     'semester' => 7,
        //     'ipk' => 3.75,
        //     'prodi_id' => $prodi1->id,
        //     'peminatan_id' => $peminatan[0]->id, // Pengembangan Sistem Informasi
        //     'user_id' => $mahasiswaSI->id,
        //     'dosen_pa' => 1,
        // ]);

        // Mahasiswa::create([
        //     'nim' => '23041450086',
        //     'nama' => 'Farah Hasywaza Audremayna',
        //     'no_hp' => '081234567891',
        //     'alamat' => 'Palembang',
        //     'semester' => 7,
        //     'ipk' => 3.88,
        //     'prodi_id' => $prodi2->id,
        //     'peminatan_id' => $peminatan[3]->id, // Mikrobiologi
        //     'user_id' => $mahasiswaBiologi->id,
        //     'dosen_pa' => 7,
        // ]);

        // Mahasiswa::create([
        //     'nim' => '23041450087',
        //     'nama' => 'Rizki Faruli',
        //     'no_hp' => '081234567892',
        //     'alamat' => 'Palembang',
        //     'semester' => 7,
        //     'ipk' => 3.50,
        //     'prodi_id' => $prodi3->id,
        //     'peminatan_id' => $peminatan[4]->id, // Kimia Analitik
        //     'user_id' => $mahasiswaKimia->id,
        //     'dosen_pa' => 13,
        // ]);



        // // Create Dosen records for the test users
        // Dosen::create([
        //     'nidn' => 'Freddy1987654321',
        //     'nama' => 'Freddy Kurnia Wijaya',
        //     'no_hp' => '081234567893',
        //     'alamat' => 'Palembang',
        //     'prodi_id' => $prodi1->id,
        // ]);

        // Dosen::create([
        //     'nidn' => 'Dimas12345',
        //     'nama' => 'Dimas Prasetyo',
        //     'no_hp' => '081234567894',
        //     'alamat' => 'Palembang',
        //     'prodi_id' => $prodi2->id,
        // ]);

        // Dosen::create([
        //     'nidn' => 'Farhan12345',
        //     'nama' => 'Farahan Pratama',
        //     'no_hp' => '081234567895',
        //     'alamat' => 'Palembang',
        //     'prodi_id' => $prodi3->id,
        // ]);

        // // Step 3: Create 6 Dosen for each prodi (18 total)
        // Dosen::factory(5)->create(['prodi_id' => $prodi1->id]);
        // Dosen::factory(5)->create(['prodi_id' => $prodi2->id]);
        // Dosen::factory(5)->create(['prodi_id' => $prodi3->id]);

        // // Step 4: Create 30 Mahasiswa for each prodi (90 total)
        // Mahasiswa::factory(30)->create(['prodi_id' => $prodi1->id]);
        // Mahasiswa::factory(30)->create(['prodi_id' => $prodi2->id]);
        // Mahasiswa::factory(30)->create(['prodi_id' => $prodi3->id]);

        //buat dosen seeder
        $this->call(DosenSeeder::class);

        //buat mahasiswa seeder
        $this->call(MahasiswaSeeder::class);

        // Step 5: Create supporting data
        //jenis ujian
        $this->call(JenisUjianSeeder::class);

        // Create some Syarat (requirements)
        \App\Models\Syarat::factory(10)->create();

        //ranpel
        $this->call(RanpelSeeder::class);

        //pengajuanRanpel
        $this->call(PengajuanRanpelSeeder::class);

        // // Create some Skripsi based on approved proposals - setelah Ranpel dibuat
        // Skripsi::factory(30)->create();

        // Create some PendaftaranUjian (exam registrations)
        $this->call(PendaftaranUjianSeeder::class);

        // // Create some Ujian (exams)
        $this->call(UjianSeeder::class);

        // // Create Bimbingan (supervisions)
        // Bimbingan::factory(40)->create();

        // // Create JadwalPenguji (examiner schedules)
        // \App\Models\JadwalPenguji::factory(30)->create();

        // // Create KomponenPenilaian (assessment components)
        $this->call(KomponenPenilaianSeeder::class);

        // // Create Penilaian (assessments)
        // \App\Models\Penilaian::factory(35)->create();

        // Create Templates
        // \App\Models\Template::factory(8)->create();

        // // Create PemenuhanSyarat (requirement fulfillments)
        // \App\Models\PemenuhanSyarat::factory(60)->create();

        // Create some Pejabat (officials)
        Pejabat::factory(3)->create();

        // $this->call(RuanganSeeder::class);

        try {
            Artisan::call('import:ujian-proposal', [
            'file' => storage_path('app/public/Data_mhs_ujian_proposal.xlsx')
            ]);
            $this->command->info('Command import:ujian-proposal telah dijalankan.');
        } catch (Exception $ex) {
            Logger()->error('Error during import:ujian-proposal - ' . $ex->getMessage());
        }

        try{
            Artisan::call('import:ujian-hasil', [
            'file' => storage_path('app/public/Data_mhs_ujian_hasil_skripsi.xlsx')
            ]);
            $this->command->info('Command import:ujian-hasil telah dijalankan.');
        } catch (Exception $ex) {
            Logger()->error('Error during import:ujian-hasil - ' . $ex->getMessage());
        }



        try {
            Artisan::call('import:ujian-proposal', [
            'file' => storage_path('app/public/Data_mhs_ujian_proposal.xlsx')
            ]);
            $this->command->info('Command import:ujian-skripsi telah dijalankan.');
        } catch (Exception $ex) {
            Logger()->error('Error during import:ujian-skripsi - ' . $ex->getMessage());
            $this->command->error('Command import:ujian-skripsi gagal dijalankan.');
        }
    }
}
