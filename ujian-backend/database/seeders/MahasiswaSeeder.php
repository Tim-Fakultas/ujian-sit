<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
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

        $initialData = [
            [
                //1
                'nim' => '23041450085',
                'nama' => 'Muhammad Luqman Al-Fauzan',
                'no_hp' => '081234567890',
                'alamat' => 'Palembang',
                'prodi_id' => 1,
                'peminatan_id' => 1,
                'semester' => 5,
                'ipk' => 3.75,
                'dosen_pa' => 1,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //2
                'nim' => '23041450086',
                'nama' => 'Farah Hasywaza Audremayna',
                'no_hp' => '081234567891',
                'prodi_id' => 2,
                'peminatan_id' => 4,
                'semester' => 5,
                'ipk' => 3.88,
                'dosen_pa' => 1,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //3
                'nim' => '23041450087',
                'nama' => 'Rizki Faruli',
                'no_hp' => '081234567892',
                'prodi_id' => 3,
                'peminatan_id' => 5,
                'semester' => 5,
                'ipk' => 3.50,
                'dosen_pa' => 13,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //4
                'nim' => '23051450228',
                'nama' => 'Muhammad Naufal',
                'no_hp' => '081234567893',
                'prodi_id' => 1,
                'peminatan_id' => 2,
                'semester' => 5,
                'ipk' => 3.60,
                'dosen_pa' => 1,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //5
                'nim' => '23041450089',
                'nama' => 'Bima Sakti Pratama',
                'no_hp' => '081234567894',
                'prodi_id' => 2,
                'peminatan_id' => 3,
                'semester' => 5,
                'ipk' => 3.70,
                'dosen_pa' => 1,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //6
                'nim' => '23041450090',
                'nama' => 'Citra Dewi Lestari',
                'no_hp' => '081234567895',
                'prodi_id' => 3,
                'peminatan_id' => 5,
                'semester' => 5,
                'ipk' => 3.80,
                'dosen_pa' => 13,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //7
                'nim' => '23041450091',
                'nama' => 'Dewi Sartika',
                'no_hp' => '081234567896',
                'prodi_id' => 1,
                'peminatan_id' => 1,
                'semester' => 5,
                'ipk' => 3.90,
                'dosen_pa' => 1,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //8
                'nim' => '23041450092',
                'nama' => 'Eka Putra Mandala',
                'no_hp' => '081234567897',
                'prodi_id' => 2,
                'peminatan_id' => 4,
                'semester' => 5,
                'ipk' => 3.55,
                'dosen_pa' => 1,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //9
                'nim' => '23041450093',
                'nama' => 'Fajar Nugroho',
                'no_hp' => '081234567898',
                'prodi_id' => 3,
                'peminatan_id' => 5,
                'semester' => 5,
                'ipk' => 3.65,
                'dosen_pa' => 13,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //10
                'nim' => '23041450094',
                'nama' => 'Gita Savitri',
                'no_hp' => '081234567899',
                'prodi_id' => 1,
                'peminatan_id' => 2,
                'semester' => 5,
                'ipk' => 3.85,
                'dosen_pa' => 1,
                'pembimbing_1' => null,
                'pembimbing_2' => null,
                'status' => 'aktif',
                'angkatan' => '2023',
            ],
            [
                //11
                'nim' => '2230803102',
                'nama' => 'Ade Kurniawan',
                'no_hp' => '081234567893',
                'prodi_id' => 1,
                'peminatan_id' => 2,
                'semester' => 7,
                'ipk' => 3.60,
                'dosen_pa' => 4,
                'pembimbing_1' => 2,
                'pembimbing_2' => 4,
                'status' => 'aktif',
                'angkatan' => '2022',
            ],

        ];

        foreach ($initialData as $data) {
            // Create user
            $user = User::create([
                'nip_nim' => $data['nim'],
                'nama' => $data['nama'],
                'email' => $data['nim'] . '@radenfatah.ac.id',
                'password' => bcrypt($data['nim']),
                'prodi_id' => $data['prodi_id']
            ]);

            // Assign role
            $user->assignRole('mahasiswa');

            // Create mahasiswa with all required fields
            Mahasiswa::create([
                'nim' => $data['nim'],
                'nama' => $data['nama'],
                'no_hp' => $data['no_hp'],
                'alamat' => $data['alamat'] ?? 'Palembang',
                'semester' => $data['semester'],
                'ipk' => $data['ipk'],
                'prodi_id' => $data['prodi_id'],
                'peminatan_id' => $data['peminatan_id'],
                'user_id' => $user->id,
                'dosen_pa' => $data['dosen_pa'],
                'status' => $data['status'],
                'angkatan' => $data['angkatan'],
                'pembimbing_1' => $data['pembimbing_1'],
                'pembimbing_2' => $data['pembimbing_2'],
            ]);
        }
    }
}
