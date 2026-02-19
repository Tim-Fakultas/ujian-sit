<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use Spatie\Permission\Models\Role;

class DeveloperUsersSeeder extends Seeder
{
    public function run()
    {
        $password = bcrypt('password');

        // 1. Mahasiswa
        $mhsUser = User::firstOrCreate(
            ['nip_nim' => 'dev_mahasiswa'],
            [
                'nama' => 'Developer Mahasiswa',
                'email' => 'dev_mahasiswa@example.com',
                'password' => $password,
                'prodi_id' => 1,
            ]
        );
        $mhsUser->assignRole('mahasiswa');
        Mahasiswa::firstOrCreate(
            ['user_id' => $mhsUser->id],
            [
                'nim' => 'dev_mahasiswa',
                'nama' => 'Developer Mahasiswa',
                'no_hp' => '081234567891',
                'alamat' => 'Dev Address',
                'semester' => 7,
                'ipk' => 3.50,
                'prodi_id' => 1,
                'angkatan' => '2023',
                'status' => 'aktif'
            ]
        );
        $this->command->info('User "dev_mahasiswa" created.');

        // 2. Dosen
        $dosenUser = User::firstOrCreate(
            ['nip_nim' => 'dev_dosen'],
            [
                'nama' => 'Developer Dosen',
                'email' => 'dev_dosen@example.com',
                'password' => $password,
                'prodi_id' => 1,
            ]
        );
        $dosenUser->assignRole('dosen');
        Dosen::firstOrCreate(
            ['user_id' => $dosenUser->id],
            [
                'nidn' => '8888888801',
                'nip' => 'dev_dosen',
                'nama' => 'Developer Dosen',
                'no_hp' => '081234567892',
                'alamat' => 'Dev Address',
                'prodi_id' => 1,
                'status' => 'aktif'
            ]
        );
        $this->command->info('User "dev_dosen" created.');

        // 3. Admin (Prodi)
        $adminUser = User::firstOrCreate(
            ['nip_nim' => 'dev_admin'],
            [
                'nama' => 'Developer Admin',
                'email' => 'dev_admin@example.com',
                'password' => $password,
                'prodi_id' => 1,
            ]
        );
        $adminUser->assignRole('admin prodi');
        $this->command->info('User "dev_admin" created.');

        // 4. Sekprodi (Also Dosen usually)
        $sekprodiUser = User::firstOrCreate(
            ['nip_nim' => 'dev_sekprodi'],
            [
                'nama' => 'Developer Sekprodi',
                'email' => 'dev_sekprodi@example.com',
                'password' => $password,
                'prodi_id' => 1,
            ]
        );
        $sekprodiUser->assignRole('sekprodi');
        // Create Dosen record for Sekprodi as they are lecturers
        Dosen::firstOrCreate(
            ['user_id' => $sekprodiUser->id],
            [
                'nidn' => '8888888802',
                'nip' => 'dev_sekprodi',
                'nama' => 'Developer Sekprodi',
                'no_hp' => '081234567893',
                'alamat' => 'Dev Address',
                'prodi_id' => 1,
                'status' => 'aktif'
            ]
        );
        $this->command->info('User "dev_sekprodi" created.');

        // 5. Kaprodi (Also Dosen/Pejabat usually)
        $kaprodiUser = User::firstOrCreate(
            ['nip_nim' => 'dev_kaprodi'],
            [
                'nama' => 'Developer Kaprodi',
                'email' => 'dev_kaprodi@example.com',
                'password' => $password,
                'prodi_id' => 1,
            ]
        );
        $kaprodiUser->assignRole('kaprodi');
        // Create Dosen record for Kaprodi
        Dosen::firstOrCreate(
            ['user_id' => $kaprodiUser->id],
            [
                'nidn' => '8888888803',
                'nip' => 'dev_kaprodi',
                'nama' => 'Developer Kaprodi',
                'no_hp' => '081234567894',
                'alamat' => 'Dev Address',
                'prodi_id' => 1,
                'status' => 'aktif'
            ]
        );
        $this->command->info('User "dev_kaprodi" created.');
    }
}
