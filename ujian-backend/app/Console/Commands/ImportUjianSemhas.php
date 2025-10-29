<?php

namespace App\Console\Commands;

use App\Imports\UjianHasilImport;
use Exception;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class ImportUjianSemhas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:ujian-semhas {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import Ujian Semhas dari file Excel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument(('file'));

        try{
            $this->info("Memulai import dari file :{$file}");
            Excel::import(new UjianHasilImport(), $file);
            $this->info('Import data ujian semhas berhasil!');
        }catch(Exception $e){
            $this->error('Gagal mengimport data:'. $e->getMessage());
            $this->error('File: ' . $e->getFile() . ' (line ' . $e->getLine() . ')');
        }

    }
}
