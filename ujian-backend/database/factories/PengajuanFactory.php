<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pengajuan>
 */
class PengajuanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::inRandomOrder()->first()?->id ?? Mahasiswa::factory(),
            'judul_skripsi' => $this->faker->sentence(),
            'tanggal_pengajuan' => $this->faker->date(),
            'tanggal_disetujui' => $this->faker->optional()->date(),
            'status' => $this->faker->randomElement(['pending', 'disetujui', 'ditolak']),
            'keterangan' => $this->faker->optional()->paragraph(),
        ];
    }
}
