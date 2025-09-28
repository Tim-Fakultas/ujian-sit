<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Ujian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JadwalPenguji>
 */
class JadwalPengujiFactory extends Factory
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
            'peran' => $this->faker->randomElement(['ketua_penguji', 'sekretaris_penguji', 'penguji_1', 'penguji_2']),
        ];
    }
}
