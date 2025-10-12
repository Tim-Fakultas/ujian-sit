<?php

namespace Database\Seeders;

use App\Models\PendaftaranUjian;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PendaftaranUjianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $keteranganList = [
            'Pengajuan Ujian Proposal',
            'Pengajuan Ujian Hasil',
            'Pengajuan Ujian Skripsi',
            'Menunggu verifikasi admin',
            'Revisi dokumen penelitian',
        ];

        for ($i = 1; $i <= 10; $i++) {

            // Simulasi apakah pengajuan sudah disetujui atau belum
            $tanggalDisetujui = rand(0, 1) ? Carbon::now()->subDays(rand(1, 10)) : null;

            // Tentukan status otomatis
            if ($tanggalDisetujui) {
                // kalau sudah disetujui → bisa dijadwalkan atau selesai
                $status = ['dijadwalkan', 'selesai'][rand(0, 1)];
            } else {
                // kalau belum disetujui → bisa menunggu atau ditolak
                $status = ['menunggu', 'ditolak'][rand(0, 1)];
            }

            PendaftaranUjian::create([
                'mahasiswa_id' => rand(1, 10),
                'ranpel_id' => rand(1, 5),
                'jenis_ujian_id' => rand(1, 3),
                'tanggal_pengajuan' => Carbon::now()->subDays(rand(5, 30)),
                'tanggal_disetujui' => $tanggalDisetujui,
                'status' => $status,
                'keterangan' => $keteranganList[array_rand($keteranganList)],
            ]);
        }
    }
}
