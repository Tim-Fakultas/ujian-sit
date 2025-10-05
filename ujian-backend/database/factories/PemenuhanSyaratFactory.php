<?php

namespace Database\Factories;

use App\Models\PendaftaranUjian;
use App\Models\Syarat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PemenuhanSyarat>
 */
class PemenuhanSyaratFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pendaftaran_ujian_id' => PendaftaranUjian::inRandomOrder()->first()->id,
            'syarat_id' => Syarat::inRandomOrder()->first()->id,
            'file_path' => $this->faker->filePath(),
            'file_name' => $this->faker->word.'.pdf',
            'file_size' => $this->faker->numberBetween(1000, 5000000),
            'mime_type' => 'application/pdf',
            'keterangan' => $this->faker->optional()->text,
            'status' => $this->faker->randomElement(['menunggu', 'valid', 'invalid']),
            'verified_by' => null,
            'verified_at' => null,
        ];
    }
}
