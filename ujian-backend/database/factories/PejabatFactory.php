<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pejabat>
 */
class PejabatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_pejabat' => $this->faker->name,
            'jabatan' => $this->faker->randomElement(['Kasub', 'Kabag', 'Wakil Dekan 1', 'Dekan']),
            'no_hp' => $this->faker->phoneNumber,
        ];
    }
}
