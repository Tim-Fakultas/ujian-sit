<?php

namespace Database\Factories;

use App\Models\JenisUjian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KomponenPenilaian>
 */
class KomponenPenilaianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jenis_ujian_id' => JenisUjian::inRandomOrder()->first()->id,
            'nama_komponen' => $this->faker->word,
            'bobot' => $this->faker->numberBetween(10, 50),
        ];
    }
}
