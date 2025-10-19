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
                'mahasiswa_id' => 21,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 2,
                'mahasiswa_id' => 22,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 3,
                'mahasiswa_id' => 23,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 4,
                'mahasiswa_id' => 24,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 5,
                'mahasiswa_id' => 25,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 6,
                'mahasiswa_id' => 26,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 7,
                'mahasiswa_id' => 27,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 8,
                'mahasiswa_id' => 28,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 9,
                'mahasiswa_id' => 29,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
            [
                'ranpel_id' => 10,
                'mahasiswa_id' => 30,
                'tanggal_pengajuan' => now(),
                'tanggal_diterima' => now(),
                'status' => 'diterima',
                'keterangan' => null,
            ],
        ];

        DB::table('pengajuan_ranpel')->insert($pengajuanRanpel);
    }
}
