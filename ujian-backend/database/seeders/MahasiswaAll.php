<?php

namespace Database\Seeders;

use App\Models\User;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Str;

class MahasiswaAll extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $file = database_path('data/Mahasiswa_Per_Angkatan_2019-2025.json');

        if (!file_exists($file)) {
            throw new \Exception("File JSON tidak ditemukan di: {$file}");
        }

        $raw = file_get_contents($file);
        $json = json_decode($raw, true);

        $now = now();
        $currentYear = $now->year;
        $currentMonth = $now->month;

        $allMahasiswa = [];

        foreach ($json as $angkatan => $mahasiswas) {
            foreach ($mahasiswas as $mhs) {
                // Hitung semester berdasarkan angkatan
                $yearDiff = $currentYear - (int) $angkatan;
                $semester = ($yearDiff * 2) + ($currentMonth >= 7 ? 1 : 0);
                $semester = max(1, min($semester, 14));

                // Buat user untuk setiap mahasiswa
                $user = User::create([
                    'nip_nim' => $mhs['nim'],
                    'nama' => Str::title($mhs['nama']),
                    'email' => $mhs['nim'] . '@radenfatah.ac.id',
                    'password' => bcrypt($mhs['nim']),
                    'prodi_id' => $mhs['prodi_id'] ?? 1,
                ]);

                // Assign role mahasiswa
                $user->assignRole('mahasiswa');

                // Buat record mahasiswa
                $allMahasiswa[] = [
                    'nim' => $mhs['nim'],
                    'nama' => Str::title($mhs['nama']),
                    'no_hp' => null,
                    'alamat' => null,
                    'prodi_id' => $mhs['prodi_id'] ?? 1,
                    'peminatan_id' => null,
                    'semester' => $semester,
                    'ipk' => round(fake()->randomFloat(2, 2.00, 4.00), 2),
                    'dosen_pa' => rand(1, 20),
                    'pembimbing_1' => null,
                    'pembimbing_2' => null,
                    'status' => 'aktif',
                    'angkatan' => $angkatan,
                    'user_id' => $user->id, 
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Masukkan semuanya ke tabel mahasiswa
        DB::table('mahasiswa')->insert($allMahasiswa);
    }
}
