<?php

namespace App\Console\Commands;

use App\Models\Mahasiswa;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SyncSemesterMahasiswa extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-semester-mahasiswa';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        $now = now();

        Mahasiswa::chunk(500, function ($mahasiswas) use ($now) {
        foreach ($mahasiswas as $mhs) {
            $semesterBaru = $this->hitungSemester(
                $mhs->angkatan,
                $now
            );

            if ($mhs->semester !== $semesterBaru) {
                $mhs->update([
                    'semester' => $semesterBaru
                ]);
            }
        }
    });

    $this->info('Semester mahasiswa tersinkron.');
    }

    private function hitungSemester(string $angkatan, Carbon $tanggal): int
{
    $start = Carbon::create((int)$angkatan, 7, 1); // Juli
    $months = $start->diffInMonths($tanggal);

    return max(1, min(intdiv($months, 6) + 1, 14));
}
}
