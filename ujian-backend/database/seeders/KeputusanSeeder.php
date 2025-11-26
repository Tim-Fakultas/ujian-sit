<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KeputusanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $keputusan = [
            ['kode' => 'A', 'nama_keputusan' => 'Dapat diterima tanpa perbaikan'],
            ['kode' => 'B', 'nama_keputusan' => 'Dapat diterima dengan perbaikan kecil'],
            ['kode' => 'C', 'nama_keputusan' => 'Dapat diterima dengan perbaikan besar'],
            ['kode' => 'D', 'nama_keputusan' => 'Belum dapat diterima'],
        ];

        foreach ($keputusan as $data) {
            DB::table('keputusan')->insert($data);
        }
    }
}
