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
            ],
            [
                'prodi_id' => 1,
                'nama_ruangan' => 'BF203',
            ],
            [
                'prodi_id' => 1,
                'nama_ruangan' => 'BF209',
            ]
        ];

        DB::table('ruangan')->insert($ruangan);
    }
}
