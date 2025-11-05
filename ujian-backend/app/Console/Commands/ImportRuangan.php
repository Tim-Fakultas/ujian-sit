<?php

namespace App\Console\Commands;

use App\Imports\RuanganImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportRuangan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:ruangan {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Buat ';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $this->info("Import Ruangan Dimulai");
            Excel::import(new RuanganImport(), $this->argument('file'));
            $this->info("Import Ruangan Selesai");
        } catch (\Throwable $th) {
            $this->error("Error mengimport Ruangan: " . $th->getMessage());
        }
    }
}
