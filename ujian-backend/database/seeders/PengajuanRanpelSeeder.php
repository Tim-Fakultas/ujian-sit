<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PengajuanRanpelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pengajuanRanpel = [
            [
                'ranpel_id' => 1,
                'mahasiswa_id' => 1,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 2,
                'mahasiswa_id' => 2,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 3,
                'mahasiswa_id' => 3,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 4,
                'mahasiswa_id' => 4,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 5,
                'mahasiswa_id' => 5,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 6,
                'mahasiswa_id' => 6,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 7,
                'mahasiswa_id' => 7,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 8,
                'mahasiswa_id' => 8,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 9,
                'mahasiswa_id' => 9,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 10,
                'mahasiswa_id' => 10,
                'tanggal_pengajuan' => now(),
                'status' => 'menunggu',
                'keterangan' => null,
            ],
        ];

        DB::table('pengajuan_ranpel')->insert($pengajuanRanpel);
    }
}
