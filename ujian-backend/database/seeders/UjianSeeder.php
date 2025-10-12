<?php

namespace Database\Seeders;

use App\Models\Ujian;
use App\Models\PendaftaranUjian;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class UjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua pendaftaran ujian yang sudah disetujui
        $pendaftaranDisetujui = PendaftaranUjian::whereIn('status', ['dijadwalkan', 'selesai'])->get();

        if ($pendaftaranDisetujui->isEmpty()) {
            $this->command->warn('Tidak ada data pendaftaran ujian yang disetujui. Seeder Ujian dilewati.');
            return;
        }

        foreach ($pendaftaranDisetujui as $pendaftaran) {
            // Tentukan waktu ujian realistis
            $tanggalUjian = $pendaftaran->tanggal_disetujui
                ? Carbon::parse($pendaftaran->tanggal_disetujui)->addDays(rand(1, 5))
                : Carbon::now()->addDays(rand(1, 7));

            $waktuMulai = $tanggalUjian->copy()->setTime(rand(8, 13), [0, 30][rand(0, 1)]);
            $durasiJam = rand(1, 2); // 1–2 jam durasi ujian
            $waktuSelesai = $waktuMulai->copy()->addHours($durasiJam);

            Ujian::create([
                'pendaftaran_ujian_id' => $pendaftaran->id,
                'jenis_ujian_id' => $pendaftaran->jenis_ujian_id,
                'mahasiswa_id' => $pendaftaran->mahasiswa_id,
                'jadwal_ujian' => $tanggalUjian,
                'waktu_mulai' => $waktuMulai,
                'waktu_selesai' => $waktuSelesai,
                'ruangan' => 'Ruang ' . ['A', 'B', 'C', 'D'][rand(0, 3)] . rand(1, 3),
                'ketua_penguji' => rand(1, 10),     // contoh id dosen dummy
                'sekretaris_penguji' => rand(1, 10),
                'penguji_1' => rand(1, 10),
                'penguji_2' => rand(1, 10),
                'hasil' => in_array($pendaftaran->status, ['selesai']) ? (rand(0, 1) ? 'lulus' : 'tidak lulus') : null,
                'nilai_akhir' => in_array($pendaftaran->status, ['selesai']) ? rand(70, 95) : null,
                'catatan' => in_array($pendaftaran->status, ['selesai'])
                    ? 'Ujian berjalan lancar, mahasiswa memahami topik dengan baik.'
                    : null,
            ]);
        }

        $this->command->info('Seeder Ujian berhasil dijalankan. ' . $pendaftaranDisetujui->count() . ' data ujian dibuat.');
    }
}
