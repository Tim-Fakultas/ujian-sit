<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Skripsi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bimbingan>
 */
class BimbinganFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pembimbing1 = Dosen::inRandomOrder()->first()->id;
        $pembimbing2 = Dosen::inRandomOrder()->skip(1)->first()->id;

        return [
            'skripsi_id' => Skripsi::inRandomOrder()->first()->id,
            'dosen_id' => Dosen::inRandomOrder()->first()->id,
            'mahasiswa_id' => Mahasiswa::inRandomOrder()->first()->id,
            'keterangan' => $this->faker->paragraph,
            'file_path' => null,
            'status' => $this->faker->randomElement(['diajukan', 'diterima', 'direvisi', 'selesai']),
        ];
    }
}
