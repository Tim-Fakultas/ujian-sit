<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RuanganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruangan = [
            [
                'prodi_id' => 1,
                'nama_ruangan' => 'BF202',
                'deskripsi' => null,
            ],
            [
                'prodi_id' => 1,
                'nama_ruangan' => 'BF203',
                'deskripsi' => null,
            ],
            [
                'prodi_id' => 1,
                'nama_ruangan' => 'BF209',
                'deskripsi' => 'Ruang Rapat Prodi',
            ],
            [
                'prodi_id' => 1,
                'nama_ruangan' => 'BF310',
                'deskripsi' => 'Ruang Kelas Lantai 3',
            ],
            [
                'prodi_id' => 1,
                'nama_ruangan' => 'BF216',
                'deskripsi' => null,
            ]
        ];

        DB::table('ruangan')->insert($ruangan);
    }
}
