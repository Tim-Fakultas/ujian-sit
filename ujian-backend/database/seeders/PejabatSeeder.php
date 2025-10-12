<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PejabatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Pejabat::factory(3)->create();
    }
}
