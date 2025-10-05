<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Ranpel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skripsi>
 */
class SkripsiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::inRandomOrder()->first()->id,
            'ranpel_id' => Ranpel::inRandomOrder()->first()->id,
            'judul' => $this->faker->sentence,
            'pembimbing_1' => Dosen::inRandomOrder()->first()->id,
            'pembimbing_2' => Dosen::inRandomOrder()->skip(1)->first()->id,
            'status' => $this->faker->randomElement(['berjalan', 'selesai', 'dibatalkan']),
        ];
    }
}
