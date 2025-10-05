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
            'peminatan_id' => null, // Will be set in configure method
            'semester' => $this->faker->numberBetween(1, 14),
            'ipk' => $this->faker->randomFloat(2, 2.00, 4.00), // IPK antara 2.00 - 4.00
            'dosen_pa' => Dosen::inRandomOrder()->first()->id,
            'user_id' => $user->id,
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (\App\Models\Mahasiswa $mahasiswa) {
            // Set peminatan based on prodi
            $peminatan = \App\Models\Peminatan::where('prodi_id', $mahasiswa->prodi_id)
                ->inRandomOrder()
                ->first();

            if ($peminatan) {
                $mahasiswa->update(['peminatan_id' => $peminatan->id]);
            }
        });
    }
}
