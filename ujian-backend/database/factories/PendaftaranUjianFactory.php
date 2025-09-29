<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PendaftaranUjian>
 */
class PendaftaranUjianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mahasiswa_id' => \App\Models\Mahasiswa::inRandomOrder()->first()->id,
            'jenis_ujian_id' => \App\Models\JenisUjian::inRandomOrder()->first()->id,
            'skripsi_id' => \App\Models\Skripsi::inRandomOrder()->first()->id,
            'status' => $this->faker->randomElement(['menunggu', 'terverifikasi', 'dijadwalkan', 'selesai']),
            'created_by' => \App\Models\User::inRandomOrder()->first()->id,
            'verified_by' => null,
            'verified_at' => null,
            'keterangan' => $this->faker->optional()->text,
        ];
    }
}
