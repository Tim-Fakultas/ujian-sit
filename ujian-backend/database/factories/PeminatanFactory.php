<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Peminatan>
 */
class PeminatanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_peminatan' => $this->faker->unique()->words(3, true),
            'prodi_id' => \App\Models\Prodi::inRandomOrder()->first()->id,
        ];
    }
}
