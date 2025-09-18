<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skripsi>
 */
class SkripsiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pengajuan_id' => \App\Models\Pengajuan::factory(),
            'mahasiswa_id' => \App\Models\Mahasiswa::factory(),
            'judul_skripsi' => $this->faker->sentence(),
            'identifikasi_masalah' => $this->faker->paragraph(),
            'rumusan_masalah' => $this->faker->paragraph(),
            'penelitian_sebelumnya' => $this->faker->paragraph(),
            'pokok_masalah' => $this->faker->paragraph(),
            'deskripsi_lengkap' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['proses', 'selesai']),
            'tanggal_mulai' => $this->faker->date(),
            'tanggal_selesai' => $this->faker->optional()->date(),
        ];
    }
}
