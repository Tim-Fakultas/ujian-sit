<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Prodi;
use App\Models\Fakultas;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $fakultas = Fakultas::first();

        Prodi::factory()->create([
            'nama_prodi' => 'Sistem Informasi',
            'fakultas_id' => $fakultas->id,
        ]);

        Prodi::factory()->create([
            'nama_prodi' => 'Biologi',
            'fakultas_id' => $fakultas->id,
        ]);

        Prodi::factory()->create([
            'nama_prodi' => 'Kimia',
            'fakultas_id' => $fakultas->id,
        ]);
    }
}
