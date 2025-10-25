<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class MahasiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleMahasiswa = Role::firstOrCreate(['name' => 'mahasiswa']);

        //$this->call(MahasiswaCoba::class);
        $this->call(MahasiswaAll::class);
    }
}
