<?php

namespace Database\Factories;

use App\Models\Judul;
use App\Models\PengajuanJudul;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ranpel>
 */
class RanpelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'judul_id' => Judul::inRandomOrder()->first()?->id ?? Judul::factory()->create()->id,
            'identifikasi_masalah' => $this->faker->paragraph,
            'rumusan_masalah' => $this->faker->paragraph,
            'penelitian_sebelumnya' => $this->faker->paragraph,
            'pokok_masalah' => $this->faker->paragraph,
            'deskripsi_lengkap' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['menunggu', 'disetujui', 'ditolak']),
        ];
    }
}
