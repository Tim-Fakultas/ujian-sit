<?php

namespace App\Console\Commands;

use App\Models\KomponenPenilaian;
use App\Models\Penilaian;
use App\Models\Ujian;
use DB;
use App\Models\Mahasiswa;
use App\Models\Dosen;
use Illuminate\Console\Command;

class PenilaianSempro extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:penilaian-sempro
                        {path=import/data_penilaian_proposal_januari-juli_csv.csv}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import penilaian sempro data';

    protected int $jenisUjianId = 1;

        /** @var array<string,\App\Models\Dosen> */
    protected array $dosenIndex = [];

    /** @var array<string,\App\Models\Mahasiswa> */
    protected array $mahasiswaIndex = [];


    protected string $logPath = '';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $relativePath = $this->argument('path');
        $path = storage_path('app/'.$relativePath);

        if(! file_exists($path)){
            $this->error("File tidak ditemukan di path: $path");
            return self::FAILURE;
        }

        if(($handle = fopen($path, "r")) === false){
            $this->error("Gagal membuka file: {$path}");
            return self::FAILURE;
        }

        $this->info("Membaca file: {$path}");

        $this->logPath = storage_path('logs/penilaian_sempro_' . date('Y-m-d_H-i-s') . '.log');

        file_put_contents($this->logPath, "=== LOG IMPORT PENILAIAN SEMPRO ===\n" . date('Y-m-d H:i:s') . "\n\n");

        $this->buildIndexes();

        $header = fgetcsv($handle, 0, ',');

        if (! $header) {
            $this->error('Header CSV tidak valid (kosong / tidak terbaca).');
            fclose($handle);
            return self::FAILURE;
        }

        // Normalisasi header: trim + hapus BOM di kolom pertama (kalau ada)
        $header = array_map(function ($col) {
            $col = trim($col);
            // hapus UTF-8 BOM di awal string
            $col = preg_replace('/^\xEF\xBB\xBF/', '', $col);
            return $col;
        }, $header);

        // Debug sekali-sekali kalau perlu
        // $this->line('HEADER NORMALISASI: ' . implode(' | ', $header));

        $index = array_flip($header);

        // Ujian,Dosen,Peran,Kriteria (Komponen_penilaian),Nilai
        $requiredColumns = [
            'Ujian',
            'Dosen',
            'Peran',
            'Kriteria (Komponen_penilaian)',
            'Nilai',
        ];

        $missing = [];
        foreach ($requiredColumns as $col) {
            if (! isset($index[$col])) {
                $missing[] = $col;
            }
        }
        if(!empty($missing)){
            $this->error("File CSV tidak memiliki kolom yang diperlukan: " . implode(', ', $missing));
            fclose($handle);
            return self::FAILURE;
        }

        $baris         = 0;
        $berhasil      = 0;
        $failKosong    = 0;
        $failMhs       = 0;
        $failUjian     = 0;
        $failDosen     = 0;
        $failKomponen  = 0;
        $skipDuplikat  = 0;

        DB::beginTransaction();

        try {
            while(($row = fgetcsv($handle, 0, ',')) !== false){
              $baris++;

              $namaMahasiswa = trim($row[$index['Ujian']] ?? '');
              $namaDosen = trim($row[$index['Dosen']] ?? '');
              $peran = trim($row[$index['Peran']] ?? '');
              $komponen = trim($row[$index['Kriteria (Komponen_penilaian)']] ?? '');
              $nilaiRaw = trim($row[$index['Nilai']] ?? '');

              if(empty($namaMahasiswa) || empty($namaDosen) || empty($peran) || empty($komponen) || $nilaiRaw === ''){
                  $failKosong++;
                  $this->logToFile("Baris {$baris}: Gagal - ada kolom kosong.");
                  continue;
              }

            $nilai = (int) round((float) $nilaiRaw);

            $mhs = $this->findMahasiswaByName($namaMahasiswa);

            if(!$mhs){
                $failMhs++;
                $this->logToFile("Baris {$baris}: Gagal - Mahasiswa '{$namaMahasiswa}' tidak ditemukan.");
                continue;
              }

            $dosen = $this->findDosenByName($namaDosen);
            if(!$dosen){
                $msg = "Baris {$baris}: Gagal - Dosen '{$namaDosen}' tidak ditemukan.";
                $this->logToFile($msg);
                $this->warn($msg);
                $failDosen++;
                continue;
            }

            $ujian = Ujian::where('mahasiswa_id', $mhs->id)
                        ->where('jenis_ujian_id', $this->jenisUjianId)
                        ->first();

            if(!$ujian){
                $msg = "BARIS TIDAK DITEMUKAN UNTUK UJIAN SEMPRO mahasiswa: {$mhs} ";
                $this->warn($msg);
                $this->logToFile($msg);
                $failUjian++;
                continue;
            }

            $peranEnum = match($peran){
                'Ketua Penguji'  =>  'ketua_penguji',
                'Sekretaris Penguji'  =>  'sekretaris_penguji',
                'Penguji 1'  =>   'penguji_1',
                'Penguji 2'  =>   'penguji_2',
                default => null
            };

            $komponenAseli = KomponenPenilaian::where('nama_komponen', $komponen)
                        ->where('jenis_ujian_id', $ujian->jenis_ujian_id)
                        ->first();

            if(! $komponen){
                $msg = "BARIS INI TIDAK ADA KOMPONEN {$komponenAseli}";
                $this->warn($msg);
                $this->logToFile($msg);
                $failKomponen++;
                continue;
            }

            $existing = Penilaian::where('ujian_id', $ujian->id)
                        ->where('dosen_id', $dosen->id)
                        ->where('komponen_penilaian_id', $komponenAseli->id)
                        ->first();

            if($existing){
                $msg = "Baris ini telah ada dengan ujian id: {$ujian->id}";
                $this->warn($msg);
                $this->logToFile($msg);
                continue;
            }

            Penilaian::create([
                'ujian_id'               => $ujian->id,
                'dosen_id'               => $dosen->id,
                'komponen_penilaian_id'  => $komponenAseli->id,
                'nilai'                  => $nilai,
                'komentar'               => null,
            ]);

            $berhasil++;

            DB::commit();
        }
        } catch (\Throwable $th) {
            DB::rollBack();
            fclose($handle);
            $this->error('Error saat import: ' . $th->getMessage());
            return self::FAILURE;
        }

        fclose($handle);

        $this->info("Import selesai:");
        $summary  = "=== RINGKASAN ===\n";
        $summary .= "Baris diproses   : {$baris}\n";
        $summary .= "Berhasil         : {$berhasil}\n";
        $summary .= "Skip duplikat    : {$skipDuplikat}\n";
        $summary .= "Gagal kosong     : {$failKosong}\n";
        $summary .= "Gagal mahasiswa  : {$failMhs}\n";
        $summary .= "Gagal ujian      : {$failUjian}\n";
        $summary .= "Gagal dosen      : {$failDosen}\n";
        $summary .= "Gagal komponen   : {$failKomponen}\n";

        file_put_contents($this->logPath, "\n".$summary, FILE_APPEND);
              $this->info("Log disimpan di: {$this->logPath}");

        $this->info("Baris diproses   : {$baris}");
        $this->info("Berhasil         : {$berhasil}");
        $this->info("Skip duplikat    : {$skipDuplikat}");
        $this->info("Gagal kosong     : {$failKosong}");
        $this->info("Gagal mahasiswa  : {$failMhs}");
        $this->info("Gagal ujian      : {$failUjian}");
        $this->info("Gagal dosen      : {$failDosen}");
        $this->info("Gagal komponen   : {$failKomponen}");

        return self::SUCCESS;
    }

    protected function buildIndexes()
    {
        $this->info('Memuat info mahasiswa dan dosen cache');
    }

   protected function normalizeName(string $name): string
    {
        $name = mb_strtolower($name, 'UTF-8');
        // buang semua karakter non-alfanumerik
        $name = preg_replace('/[^a-z0-9]/u', '', $name) ?? '';
        return $name;
    }

    protected function findMahasiswaByName(string $nama): ?Mahasiswa
    {
        $norm = $this->normalizeName($nama);

        // Exact normalized match
        if (isset($this->mahasiswaIndex[$norm])) {
            return $this->mahasiswaIndex[$norm];
        }

        // Fuzzy: cari yang mengandung / terkandung
        foreach ($this->mahasiswaIndex as $key => $mhs) {
            if (str_contains($key, $norm) || str_contains($norm, $key)) {
                return $mhs;
            }
        }

        return null;
    }

    protected function findDosenByName(string $nama): ?Dosen
    {
        $norm = $this->normalizeName($nama);

        // Exact normalized match
        if (isset($this->dosenIndex[$norm])) {
            return $this->dosenIndex[$norm];
        }

        // Fuzzy: cari yang mengandung / terkandung
        foreach ($this->dosenIndex as $key => $dosen) {
            if (str_contains($key, $norm) || str_contains($norm, $key)) {
                return $dosen;
            }
        }

        return null;
    }
     protected function logToFile(string $text): void
    {
        file_put_contents($this->logPath, $text . "\n", FILE_APPEND);
    }


}
