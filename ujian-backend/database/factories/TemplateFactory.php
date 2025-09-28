<?php

namespace Database\Factories;

use App\Models\JenisUjian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Template>
 */
class TemplateFactory extends Factory
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
            'nama_template' => $this->faker->word,
            'deskripsi' => $this->faker->optional()->text,
            'file_path' => $this->faker->filePath(),
        ];
    }
}
