<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Prodi;
use Illuminate\Database\Eloquent\Factories\Factory;
use Spatie\Permission\Models\Role;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mahasiswa>
 */
class MahasiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nim = $this->faker->unique()->numerify('230########');
        $nama = $this->faker->name;

        // Create a user for this mahasiswa
        $user = \App\Models\User::factory()->create([
            'nip_nim' => $nim,
            'nama' => $nama,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt($nim), // Use NIM as password
        ]);

        // Assign mahasiswa role to the user if it exists
        $mahasiswaRole = Role::where('name', 'mahasiswa')->first();
        if ($mahasiswaRole) {
            $user->assignRole('mahasiswa');
        }

        return [
            'nim' => $nim,
            'nama' => $nama,
            'no_hp' => $this->faker->phoneNumber,
            'alamat' => $this->faker->address,
            'prodi_id' => Prodi::inRandomOrder()->first()->id,
            'semester' => $this->faker->numberBetween(1, 14),
            'dosen_pa' => Dosen::inRandomOrder()->first()->id,
            'user_id' => $user->id,
        ];
    }
}
