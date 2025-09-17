<?php

namespace Database\Factories;

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
        return [
           'skripsi_id' => \App\Models\Skripsi::factory(),
           'mahasiswa_id' => \App\Models\Mahasiswa::factory(),
           'pembimbing_1' => \App\Models\Dosen::factory(),
           'pembimbing_2' => \App\Models\Dosen::factory(),
           'keterangan' => $this->faker->paragraph(),
        ];
    }
}
