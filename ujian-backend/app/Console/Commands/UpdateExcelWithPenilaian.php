<?php

namespace App\Console\Commands;

use Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Console\Command;
use App\Services\OCRService;

class UpdateExcelWithPenilaian extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'penilaian:update-excel {excelPath} {pdfFolder}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Excel daftar ujian dengan nilai dari file PDF hasil scan';


    /**
     * Execute the console command.
     */
    public function handle(OCRService $ocr)
    {
        $excelPath = $this->argument('excelPath');
    $pdfFolder = $this->argument('pdfFolder');

    // Pastikan path absolut
    if (!str_starts_with($excelPath, storage_path())) {
        $excelPath = base_path($excelPath);
    }
    if (!str_starts_with($pdfFolder, storage_path())) {
        $pdfFolder = base_path($pdfFolder);
    }

    $this->info("📄 Membuka file Excel: {$excelPath}");
    \Log::info("Mulai proses update Excel", ['file' => $excelPath, 'pdfFolder' => $pdfFolder]);

    $spreadsheet = IOFactory::load($excelPath);
    $sheet = $spreadsheet->getActiveSheet();
    $rows = $sheet->toArray();

    // Ambil semua file PDF/PNG
    $pdfFiles = collect(glob($pdfFolder . '/*.{pdf,png,jpg,jpeg}', GLOB_BRACE));

    if ($pdfFiles->isEmpty()) {
        $this->warn("⚠️ Tidak ditemukan file PDF/PNG di folder {$pdfFolder}");
        \Log::warning("Tidak ada file PDF/PNG ditemukan", ['folder' => $pdfFolder]);
        return;
    }

    foreach ($pdfFiles as $pdfFile) {
        $this->line("🔍 Memproses file: {$pdfFile}");
        \Log::info("Memproses file penilaian", ['file' => $pdfFile]);

        try {
            $text = $ocr->extractText($pdfFile);
            \Log::debug("Hasil OCR mentah", ['file' => $pdfFile, 'text' => $text]);

            preg_match('/NIM\s*:\s*(\d+)/', $text, $nim);
            preg_match('/Ketua Penguji\s*:\s*(.+)/', $text, $ketua);
            preg_match_all('/(\d{1,2}[.,]?\d?)/', $text, $matches);

            // replace null-coalescing (??) with isset() checks for older PHP versions
            $nilaiList = isset($matches[1]) ? $matches[1] : [];
            $total = array_sum(array_map('floatval', $nilaiList));
            $count = count($nilaiList);
            $rata = $count > 0 ? $total / $count : 0;

            \Log::info("Hasil parsing nilai", [
                'file' => basename($pdfFile),
                'nim' => isset($nim[1]) ? $nim[1] : null,
                'ketua' => isset($ketua[1]) ? $ketua[1] : null,
                'nilai' => $nilaiList,
                'rata_rata' => $rata,
            ]);

            foreach ($rows as $i => $row) {
                if (isset($nim[1]) && $row[1] == $nim[1]) {
                    $sheet->setCellValue("H" . ($i + 1), $rata);
                    Log::info("Nilai berhasil diisi ke baris Excel", [
                        'nim' => $nim[1],
                        'row' => $i + 1,
                        'nilai' => $rata,
                    ]);
                }
            }

            $this->info("✔️ Nilai Ketua untuk NIM " . (isset($nim[1]) ? $nim[1] : 'Unknown') . " berhasil diisi (rata-rata: {$rata})");

        } catch (\Exception $e) {
            $this->error("❌ Gagal memproses file {$pdfFile}: {$e->getMessage()}");
            \Log::error("Gagal memproses file", [
                'file' => $pdfFile,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    $writer = new Xlsx($spreadsheet);
    $writer->save($excelPath);

    $this->info("✅ Semua nilai berhasil dimasukkan ke Excel: {$excelPath}");
    \Log::info("Selesai update Excel", ['file' => $excelPath]);
    }
}
