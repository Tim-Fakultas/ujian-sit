<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class MahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleMahasiswa = Role::firstOrCreate(['name' => 'mahasiswa']);

        $users = User::factory(10)->create();
        foreach ($users as $user) {
            $user->assignRole('mahasiswa');
            $user->mahasiswa()->create([
                'nim' => $user->nip_nim,
                'nama' => $user->nama,
                'no_hp' => fake()->phoneNumber(),
                'alamat' => fake()->address(),
                'prodi_id' => rand(1, 5), // Assuming there are 5 prodi
                'semester' => rand(1, 8),
                'dosen_pa' => rand(1, 10), // Assuming there are 10 dosen
            ]);
        }
    }
}
