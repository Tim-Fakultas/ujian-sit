<?php

namespace App\Console\Commands;

use App\Imports\UjianProposalImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportUjianSempro extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:ujian-proposal {file}';
    protected $description = 'Import data ujian seminar proposal dari file Excel';


    /**
     * The console command description.
     *
     * @var string
     */

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument('file');

        try{
            $this->info("Memulai import dari file: {$file}");
            Excel::import(new UjianProposalImport(), $file);
            $this->info('Import data ujian seminar proposal berhasil!');
        } catch (\Exception $e) {
            $this->error('Gagal mengimpor data: ' . $e->getMessage());
            $this->error('File: ' . $e->getFile() . ' (line ' . $e->getLine() . ')');
        }

    }
}
