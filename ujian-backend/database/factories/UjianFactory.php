<?php

namespace Database\Factories;

use App\Models\JenisUjian;
use App\Models\Mahasiswa;
use App\Models\PendaftaranUjian;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ujian>
 */
class UjianFactory extends Factory
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
            'jenis_ujian_id' => JenisUjian::inRandomOrder()->first()->id,
            'mahasiswa_id' => Mahasiswa::inRandomOrder()->first()->id,
            'jadwal_ujian' => $this->faker->dateTimeBetween('+1 week', '+1 month'),
            'waktu_mulai' => $this->faker->time(),
            'waktu_selesai' => $this->faker->time(),
            'ruangan' => 'Ruang '.$this->faker->numberBetween(1, 20),
            'status' => $this->faker->randomElement(['dijadwalkan', 'selesai', 'dibatalkan']),
            'hasil' => null,
            'nilai' => null,
            'created_by' => User::inRandomOrder()->first()->id,
            'updated_by' => null,
            'catatan' => $this->faker->optional()->text,
        ];
    }
}
