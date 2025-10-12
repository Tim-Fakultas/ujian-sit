<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SkripsiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Skripsi::factory(30)->create();
    }
}
