<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\KomponenPenilaian;
use App\Models\Ujian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Penilaian>
 */
class PenilaianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ujian_id' => Ujian::inRandomOrder()->first()->id,
            'dosen_id' => Dosen::inRandomOrder()->first()->id,
            'komponen_penilaian_id' => KomponenPenilaian::inRandomOrder()->first()->id,
            'nilai' => $this->faker->numberBetween(50, 100),
            'komentar' => $this->faker->optional()->sentence,
        ];
    }
}
