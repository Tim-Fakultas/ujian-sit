<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PengajuanJudul>
 */
class PengajuanJudulFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::inRandomOrder()->first()->id,
            'judul' => $this->faker->sentence(6),
            'deskripsi' => $this->faker->paragraph,
            'tanggal_pengajuan' => $this->faker->date(),
            'tanggal_disetujui' => null,
            'status' => $this->faker->randomElement(['menunggu', 'disetujui', 'ditolak']),
            'dosen_id' => Dosen::inRandomOrder()->first()->id,
            'keterangan' => $this->faker->optional()->text,
        ];
    }
}
