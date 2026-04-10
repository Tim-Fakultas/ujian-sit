<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Dosen;
use Str;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $adminUser = User::create([
            'id' => 1,
            'nip_nim' => '2120803026',
            'nama' => 'Muhammad Adib Saputra',
            'email' => 'Abdi@example.com',
            'password' => bcrypt('2120803026'),
            'prodi_id' => null,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $dosenSI = User::create([
            'id' => 2,
            'nip_nim' => 'Freddy1987654321',
            'nama' => 'Freddy Kurnia Wijaya',
            'email' => 'freddykurnia@gmail.com',
            'password' => bcrypt('Freddy1987654321'),
            'prodi_id' => 1,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $dosenBiologi = User::create([
            'id' => 3,
            'nip_nim' => 'Dimas12345',
            'nama' => 'Dimas Prasetyo',
            'email' => 'dimas@gmail.com',
            'password' => bcrypt('Dimas12345'),
            'prodi_id' => 2,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $dosenKimia = User::create([
            'id' => 4,
            'nip_nim' => 'Farhan12345',
            'nama' => 'Farahan Pratama',
            'email' => 'farhan@gmail.com',
            'password' => bcrypt('Farhan12345'),
            'prodi_id' => 3,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $mahasiswaSI = User::create([
            'id' => 5,
            'nip_nim' => '23041450085',
            'nama' => 'Muhammad Luqman Al-Fauzan',
            'email' => '23041450085@radenfatah.ac.id',
            'password' => bcrypt('23041450085'),
            'prodi_id' => 1,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $mahasiswaBiologi = User::create([
            'id' => 6,
            'nip_nim' => '23041450086',
            'nama' => 'Farah Hasywaza Audremayna',
            'email' => '23041450086@radenfatah.ac.id',
            'password' => bcrypt('23041450086'),
            'prodi_id' => 2,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $mahasiswaKimia = User::create([
            'id' => 7,
            'nip_nim' => '23041450087',
            'nama' => 'Rizki Faruli',
            'email' => '23041450087@radenfatah.ac.id',
            'password' => bcrypt('23041450087'),
            'prodi_id' => 3,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $kaprodi = User::create([
            'id' => 9,
            'nip_nim' => 'Kaprodi12345',
            'nama' => 'Kaprodi Testiana, M.Kom',
            'email' => 'kaprodi@radenfatah.ac.id',
            'password' => bcrypt('Kaprodi12345'),
            'prodi_id' => 1,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $sekprodi = User::create([
            'id' => 10,
            'nip_nim' => 'Sekprodi12345',
            'nama' => 'Sekprodi Testiana, M.Kom',
            'email' => 'sekprodi@radenfatah.ac.id',
            'password' => bcrypt('Sekprodi12345'),
            'prodi_id' => 1,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $adminProdiSI = User::create([
            'id' => 11,
            'nip_nim' => 'AdminSI',
            'nama' => 'Admin Prodi Sistem Informasi',
            'email' => 'adminsi@radenfatah.ac.id',
            'password' => bcrypt('AdminSI'),
            'prodi_id' => 1,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $adminProdiBiologi = User::create([
            'id' => 12,
            'nip_nim' => 'AdminBio12345',
            'nama' => 'Admin Prodi Biologi',
            'email' => 'biologi@radenfatah.ac.id',
            'password' => bcrypt('AdminBio12345'),
            'prodi_id' => 2,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $adminProdiKimia = User::create([
            'id' => 13,
            'nip_nim' => 'AdminKimia123',
            'nama' => 'Admin Prodi Kimia',
            'email' => 'AdminKimia123@radenfatah.ac.id',
            'password' => bcrypt('AdminKimia123'),
            'prodi_id' => 3,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $kaprodiBaru = User::create([
            'id' => 14,
            'nip_nim' => '198701012015011001',
            'nama' => 'Dr. Jane Doe, M.T.',
            'email' => 'janedoe@example.com',
            'password' => bcrypt('password'),
            'prodi_id' => 1,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $sekprodiBaru = User::create([
            'id' => 15,
            'nip_nim' => '198801012015011002',
            'nama' => 'John Smith, M.Cs.',
            'email' => 'johnsmith@example.com',
            'password' => bcrypt('password'),
            'prodi_id' => 1,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $dosenBaru = User::create([
            'id' => 16,
            'nip_nim' => '198901012015011003',
            'nama' => 'Alice Johnson, M.Pd.',
            'email' => 'alice@example.com',
            'password' => bcrypt('password'),
            'prodi_id' => 1,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        // Assign roles (assuming RolesAndPermissionsSeeder already created roles)
        $adminUser->assignRole('super admin');
        $dosenSI->assignRole('dosen');
        $dosenBiologi->assignRole('dosen');
        $dosenKimia->assignRole('dosen');
        $mahasiswaSI->assignRole('mahasiswa');
        $mahasiswaBiologi->assignRole('mahasiswa');
        $mahasiswaKimia->assignRole('mahasiswa');
        $adminProdiSI->assignRole('admin prodi');
        $adminProdiBiologi->assignRole('admin prodi');
        $adminProdiKimia->assignRole('admin prodi');
        $sekprodi->assignRole('sekprodi');
        $kaprodi->assignRole('kaprodi');

        $kaprodiBaru->assignRole('kaprodi');
        $sekprodiBaru->assignRole('sekprodi');
        $dosenBaru->assignRole('dosen');

        Dosen::create([
            'user_id' => $kaprodiBaru->id,
            'nidn' => '0000000001',
            'nip' => '198701012015011001',
            'nama' => 'Dr. Jane Doe, M.T.',
            'prodi_id' => 1,
            'status' => 'aktif',
            'jabatan' => 'Ka Prodi',
        ]);

        Dosen::create([
            'user_id' => $sekprodiBaru->id,
            'nidn' => '0000000002',
            'nip' => '198801012015011002',
            'nama' => 'John Smith, M.Cs.',
            'prodi_id' => 1,
            'status' => 'aktif',
            'jabatan' => 'Sekprodi',
        ]);

        Dosen::create([
            'user_id' => $dosenBaru->id,
            'nidn' => '0000000003',
            'nip' => '198901012015011003',
            'nama' => 'Alice Johnson, M.Pd.',
            'prodi_id' => 1,
            'status' => 'aktif',
            'jabatan' => 'Dosen',
        ]);
    }
}
