<?php

namespace App\Console\Commands;

use App\Models\Ujian;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateUjianStatusCommand extends Command
{ protected $signature = 'ujian:update-status';
    protected $description = 'Update status pendaftaran ujian menjadi selesai jika tanggal ujian telah lewat';

    public function handle()
    {
        $today = Carbon::today();

        // Ambil semua ujian yang jadwalnya sudah lewat dan belum selesai
        $ujians = Ujian::whereDate('jadwal_ujian', '<', $today)
            ->whereHas('pendaftaranUjian', function ($query) {
                $query->whereIn('status', ['dijadwalkan', 'diterima']);
            })
            ->get();

        foreach ($ujians as $ujian) {
            $ujian->pendaftaranUjian->update(['status' => 'selesai']);
        }

        $this->info(count($ujians) . ' ujian telah diperbarui ke status selesai.');
        return Command::SUCCESS;
    }
}
