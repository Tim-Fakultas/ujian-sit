<?php

namespace Database\Factories;

use App\Models\Prodi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dosen>
 */
class DosenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => $this->faker->name,
            'nidn' => $this->faker->unique()->numerify('1000####'),
            'no_hp' => $this->faker->phoneNumber,
            'alamat' => $this->faker->address,
            'prodi_id' => Prodi::inRandomOrder()->first()->id,
        ];
    }
}
