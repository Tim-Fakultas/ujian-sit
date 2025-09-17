<?php

namespace Database\Factories;

use App\Models\Prodi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mahasiswa>
 */
class MahasiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nim' => $this->faker->unique()->numerify('230########'),
            'nama' => $this->faker->name,
            'no_hp' => $this->faker->phoneNumber,
            'alamat' => $this->faker->address,
            'prodi_id' => Prodi::inRandomOrder()->first()->id,
        ];
    }
}
