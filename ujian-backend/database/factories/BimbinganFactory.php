<?php

namespace Database\Factories;

use App\Models\Dosen;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Queue\Middleware\Skip;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bimbingan>
 */
class BimbinganFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pembimbing1 = Dosen::inRandomOrder()->first()->id;
        $pembimbing2 = Dosen::inRandomOrder()->skip(1)->first()->id;
        return [
           'skripsi_id' => null,
           'pembimbing_1' => $pembimbing1,
           'pembimbing_2' => $pembimbing2,
           'keterangan' => $this->faker->paragraph(),
        ];
    }
}
