<?php

namespace App\Console\Commands;

use App\Imports\UjianSkripsiImport;
use Exception;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportUjianSkripsi extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:ujian-skripsi {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data ujian skripsi dari file Excel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $this->info("Memulai import data ujian skripsi...");
            Excel::import(new UjianSkripsiImport(), $this->argument('file'));
            $this->info('Import data ujian skripsi berhasil!');
        } catch (Exception $e) {
            $this->info('Gagal mengimpor data: ' . $e->getMessage());
            $this->info('File: ' . $e->getFile() . ' (line ' . $e->getLine() . ')');
        }

    }
}
