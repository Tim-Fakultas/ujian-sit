<?php

namespace App\Imports;

use App\Models\Prodi;
use App\Models\Ruangan;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;

class RuanganImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            // Lewati header baris pertama jika ada
            if ($index === 0) continue;
            Log::info("Row {$index}: " . json_encode($row));

            try {
                $namaRuangan = trim($row[1] ?? '');
                $deskripsi = trim($row[2] ?? '');
                $prodiRaw = trim($row[7] ?? '');

                if (empty($namaRuangan)) {
                    Log::warning("Row {$index}: nama_ruangan kosong, dilewati.");
                    continue;
                }

                if (empty($prodiRaw)) {
                    Log::warning("Row {$index}: prodi kosong untuk ruangan {$namaRuangan}, dilewati.");
                    continue;
                }

                $prodi = Prodi::where('nama_prodi', 'LIKE', "%{$prodiRaw}%")->first();

                if (!$prodi) {
                    Log::warning("Row {$index}: prodi '{$prodiRaw}' tidak ditemukan, dilewati.");
                    continue;
                }

                Ruangan::create([
                    'nama_ruangan' => $namaRuangan,
                    'deskripsi' => $deskripsi,
                    'prodi_id' => $prodi->id,
                ]);

            } catch (Exception $e) {
                Log::error("Error processing row " . ($index + 1) . ": " . $e->getMessage());
            }
        }
    }
}
