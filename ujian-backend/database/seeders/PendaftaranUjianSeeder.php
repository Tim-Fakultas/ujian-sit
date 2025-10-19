<?php

namespace Database\Seeders;

use App\Models\PendaftaranUjian;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PendaftaranUjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pendaftaranUjian = [
            [
                'mahasiswa_id' => 21,
                'ranpel_id' => 1,
                'jenis_ujian_id' => 1,
                'tanggal_pengajuan' => Carbon::now()->subDays(10),
                'status' => 'menunggu',
            ],
            [
                'mahasiswa_id' => 22,
                'ranpel_id' => 2,
                'jenis_ujian_id' => 2,
                'tanggal_pengajuan' => Carbon::now()->subDays(8),
                'status' => 'menunggu',
            ],
            [
                'mahasiswa_id' => 23,
                'ranpel_id' => 3,
                'jenis_ujian_id' => 3,
                'tanggal_pengajuan' => Carbon::now()->subDays(5),
                'status' => 'menunggu',
            ],
        ];

        PendaftaranUjian::insert($pendaftaranUjian);
    }
}
