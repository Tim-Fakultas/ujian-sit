<?php

namespace Database\Factories;

use App\Models\JenisUjian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Syarat>
 */
class SyaratFactory extends Factory
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
            'nama_syarat' => $this->faker->word,
            'kategori' => $this->faker->randomElement(['akademik','administratif','bimbingan']),
            'deskripsi' => $this->faker->optional()->text,
            'wajib' => true,
        ];
    }
}
