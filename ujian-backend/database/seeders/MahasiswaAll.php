<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
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

        $csvFile = database_path('data/dosen_pa_initial.csv');
        if(!file_exists($csvFile)) {
            throw new \Exception("File CSV dosen PA tidak ditemukan di: {$csvFile}");
        }

        $csv = array_map('str_getcsv', file($csvFile));
        $rawHeader = array_shift($csv);
        $header = array_map('trim', $rawHeader);
        $headerCount = count($header);

        $dosenPAData = [];
        foreach ($csv as $i => $row) {
            if(count(array_filter($row)) === 0) {
                continue; // skip empty rows
            }

            $row = array_slice($row, 0, $headerCount);
            $row = array_pad($row, $headerCount, null);

            $data = array_combine($header, $row);


            if(!isset($data['NIM']) || !isset($data['Penasehat Akademik'])) {
                throw new \Exception("Format CSV dosen PA tidak sesuai di: " . ($i + 2) . " pada file: {$csvFile}");
            }

            $nim = trim($data['NIM']);
            $dosenPa = trim($data['Penasehat Akademik']);
            $dosenPAData[$nim] = (int) $dosenPa;
        }



        $now = now();
        $currentYear = $now->year;
        $currentMonth = $now->month;

        $allMahasiswa = [];

        foreach ($json as $angkatan => $mahasiswas) {
            // Skip angkatan 2020 and older
            if ((int)$angkatan < 2021) {
                continue;
            }

            foreach ($mahasiswas as $mhs) {
                // Skip NIM starting with 20 or older (prefix check)
                $nimPrefix = substr($mhs['nim'], 0, 2);
                if (is_numeric($nimPrefix) && (int)$nimPrefix < 21) {
                    continue;
                }

                $start = Carbon::createFromDate((int)$angkatan, 7, 1);
                $months = $start->diffInMonths($now);
                $semester = intdiv($months, 6) + 1;
                $semester = max(1, min($semester, 14));

                // Buat atau ambil user yang sudah ada (skip jika duplikat)
                $user = User::firstOrCreate(
                    ['nip_nim' => $mhs['nim']],
                    [
                        'nama'     => Str::title($mhs['nama']),
                        'email'    => $mhs['nim'] . '@radenfatah.ac.id',
                        'password' => bcrypt($mhs['nim']),
                        'prodi_id' => $mhs['prodi_id'] ?? 1,
                    ]
                );

                // Assign role mahasiswa (idempotent — tidak duplikat)
                if (!$user->hasRole('mahasiswa')) {
                    $user->assignRole('mahasiswa');
                }

                // Skip jika mahasiswa sudah ada di tabel
                if (DB::table('mahasiswa')->where('nim', $mhs['nim'])->exists()) {
                    continue;
                }

                // Buat record mahasiswa
                $allMahasiswa[] = [
                    'nim'           => $mhs['nim'],
                    'nama'          => Str::title($mhs['nama']),
                    'no_hp'         => null,
                    'alamat'        => null,
                    'prodi_id'      => $mhs['prodi_id'] ?? 1,
                    'peminatan_id'  => null,
                    'semester'      => $semester,
                    'ipk'           => round(fake()->randomFloat(2, 2.00, 4.00), 2),
                    'dosen_pa'      => $dosenPAData[$mhs['nim']] ?? null,
                    'pembimbing_1'  => null,
                    'pembimbing_2'  => null,
                    'status'        => 'aktif',
                    'angkatan'      => $angkatan,
                    'user_id'       => $user->id,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];
            }
        }

        // Masukkan semuanya ke tabel mahasiswa
        DB::table('mahasiswa')->insert($allMahasiswa);
    }
}
