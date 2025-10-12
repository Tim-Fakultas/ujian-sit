<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fakultas;

class FakultasSeeder extends Seeder
{
    public function run(): void
    {
        Fakultas::factory()->create([
            'nama_fakultas' => 'Fakultas Sains dan Teknologi',
        ]);
    }
}
