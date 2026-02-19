<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use Spatie\Permission\Models\Role;

class SuperUserSeeder extends Seeder
{
    public function run()
    {
        // 1. Create User
        $user = User::firstOrCreate(
            ['nip_nim' => 'superuser'],
            [
                'nama' => 'Super User Testing',
                'email' => 'superuser@example.com',
                'password' => bcrypt('password'), // Easy password
                'prodi_id' => 1, // Default to first prodi
            ]
        );

        // 2. Assign All Roles
        $roles = Role::all()->pluck('name')->toArray();
        $user->syncRoles($roles);

        $this->command->info('User "superuser" created with all roles.');

        // 3. Create Mahasiswa Record
        Mahasiswa::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nim' => 'superuser', // reusing nip_nim as nim
                'nama' => 'Super User Testing',
                'no_hp' => '081234567890',
                'alamat' => 'Test Address',
                'semester' => 8,
                'ipk' => 4.00,
                'prodi_id' => 1,
                'angkatan' => '2023',
                'status' => 'aktif'
            ]
        );
        $this->command->info('Mahasiswa record created.');

        // 4. Create Dosen Record
        Dosen::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nidn' => '9999999999',
                'nip' => 'superuser',
                'nama' => 'Super User Testing',
                'no_hp' => '081234567890',
                'alamat' => 'Test Address',
                'prodi_id' => 1,
                'status' => 'aktif'
            ]
        );
        $this->command->info('Dosen record created.');
    }
}
