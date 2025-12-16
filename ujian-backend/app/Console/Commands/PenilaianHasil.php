<?php

namespace App\Console\Commands;

use App\Models\Dosen;
use App\Models\KomponenPenilaian;
use App\Models\Mahasiswa;
use App\Models\Penilaian;
use App\Models\Ujian;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PenilaianHasil extends Command
{
    protected $signature = 'import:penilaian-hasil
        {path=import/data_penilaian_hasil_jul-des.csv}';

    protected $description = 'Import penilaian ujian hasil skripsi dari CSV ke tabel penilaian';

    // SESUAIKAN kalau id jenis ujian "Hasil" beda
    protected int $jenisUjianHasilId = 2;

    /** @var array<string,\App\Models\Dosen> */
    protected array $dosenIndex = [];

    /** @var array<string,\App\Models\Mahasiswa> */
    protected array $mahasiswaIndex = [];

    protected string $logPath = '';


    public function handle(): int
    {
        $relativePath = $this->argument('path');
        $path = storage_path('app/' . $relativePath);

        if (! file_exists($path)) {
            $this->error("File tidak ditemukan: {$path}");
            return self::FAILURE;
        }

        if (($handle = fopen($path, 'r')) === false) {
            $this->error("Gagal membuka file: {$path}");
            return self::FAILURE;
        }

        $this->info("Membaca file: {$path}");

        // Path log — disimpan di storage/logs/
        // Format: penilaian_hasil_YYYY-MM-DD_HH-MM-SS.log
        $this->logPath = storage_path('logs/penilaian_hasil_' . date('Y-m-d_H-i-s') . '.log');

        // Bikin file kosong dulu
       file_put_contents($this->logPath, "=== LOG IMPORT PENILAIAN HASIL ===\n" . date('Y-m-d H:i:s') . "\n\n");


        // 0) Build index dosen & mahasiswa di memori
        $this->buildIndexes();

        // 1) Baca header
        $header = fgetcsv($handle, 0, ',');
        if (! $header) {
            $this->error('Header CSV tidak valid (kosong / tidak terbaca).');
            fclose($handle);
            return self::FAILURE;
        }

        // Normalisasi header (trim)
        $header = array_map('trim', $header);
        $index  = array_flip($header);

        // Ini HARUS sesuai dengan file-mu:
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

        if (! empty($missing)) {
            $this->error('Kolom header CSV tidak sesuai.');
            $this->line('Header yang terbaca:');
            $this->line('  ' . implode(' | ', $header));
            $this->line('Kolom wajib yang belum ketemu:');
            $this->line('  ' . implode(' | ', $missing));
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

        // Mapping manual typo nama komponen (yang kita sudah tahu)
        $mapNamaKomponen = [
            'Metodologi dan Konten Teknis' => 'Metodologi dan Konteks Teknis',
            // tambah kalau ketemu kasus lain
        ];

        DB::beginTransaction();

        try {
            while (($row = fgetcsv($handle, 0, ',')) !== false) {
                $baris++;

                $namaMahasiswa = trim($row[$index['Ujian']] ?? '');
                $namaDosen     = trim($row[$index['Dosen']] ?? '');
                $peranCsv      = trim($row[$index['Peran']] ?? '');
                $namaKomponen  = trim($row[$index['Kriteria (Komponen_penilaian)']] ?? '');
                $nilaiRaw      = trim($row[$index['Nilai']] ?? '');

                // Cek field wajib
                if ($namaMahasiswa === '' || $namaDosen === '' || $namaKomponen === '' || $nilaiRaw === '') {
                    $this->warn("Baris {$baris}: data wajib kosong, lewati.");
                    $failKosong++;
                    continue;
                }

                $nilai = (int) round((float) $nilaiRaw);

                // === 1) Mahasiswa (pakai index + normalisasi + fuzzy) ===
                $mhs = $this->findMahasiswaByName($namaMahasiswa);

                if (! $mhs) {
                    $msg = "Baris {$baris}: MAHASISWA TIDAK KETEMU: '{$namaMahasiswa}'";
                    $this->warn($msg);
                    $this->logToFile($msg);

                    $failMhs++;
                    continue;
                }

                // === 2) Ujian Hasil mahasiswa ini ===
                $ujian = Ujian::where('mahasiswa_id', $mhs->id)
                    ->where('jenis_ujian_id', $this->jenisUjianHasilId)
                    ->orderByDesc('jadwal_ujian')
                    ->first();

                if (! $ujian) {
                    $msg = "Baris {$baris}: UJIAN HASIL tidak ditemukan untuk '{$namaMahasiswa}' (jenis_ujian_id={$this->jenisUjianHasilId}).";
                    $this->warn($msg);
                    $this->logToFile($msg);
                    $failUjian++;
                    continue;
                }

                // === 3) Dosen (pakai index + normalisasi + fuzzy) ===
                $dosen = $this->findDosenByName($namaDosen);

                if (! $dosen) {
                    $msg = "Baris {$baris}: DOSEN TIDAK KETEMU: '{$namaDosen}'";
                    $this->warn($msg);
                    $this->logToFile($msg);
                    $failDosen++;
                    continue;
                }

                // === 4) Normalisasi peran (opsional) ===
                $peranEnum = match ($peranCsv) {
                    'Ketua Penguji'      => 'ketua_penguji',
                    'Sekretaris Penguji' => 'sekretaris_penguji',
                    'Penguji 1'          => 'penguji_1',
                    'Penguji 2'          => 'penguji_2',
                    default              => null,
                };
                // peranEnum tidak dipakai sebagai gate di sini, hanya kalau nanti mau disimpan

                // === 5) Komponen Penilaian ===
                if (isset($mapNamaKomponen[$namaKomponen])) {
                    $namaKomponen = $mapNamaKomponen[$namaKomponen];
                }

                $komponen = KomponenPenilaian::where('nama_komponen', $namaKomponen)
                    ->where('jenis_ujian_id', $ujian->jenis_ujian_id)
                    ->first();

                if (! $komponen) {
                    $msg = "Baris {$baris}: KOMPONEN TIDAK KETEMU: '{$namaKomponen}' (jenis_ujian_id={$ujian->jenis_ujian_id}).";
                    $this->warn($msg);
                    $this->logToFile($msg);
                    $failKomponen++;
                    continue;
                }

                // === 6) Hindari duplikat penilaian ===
                $existing = Penilaian::where('ujian_id', $ujian->id)
                    ->where('dosen_id', $dosen->id)
                    ->where('komponen_penilaian_id', $komponen->id)
                    ->first();

                if ($existing) {
                    $this->warn("Baris {$baris}: penilaian sudah ada (ujian_id={$ujian->id}, dosen_id={$dosen->id}, komponen_id={$komponen->id}), skip.");
                    $skipDuplikat++;
                    continue;
                }

                // === 7) Insert ke penilaian ===
                Penilaian::create([
                    'ujian_id'               => $ujian->id,
                    'dosen_id'               => $dosen->id,
                    'komponen_penilaian_id'  => $komponen->id,
                    'nilai'                  => $nilai,
                    'komentar'               => null,
                ]);

                $berhasil++;
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            fclose($handle);
            $this->error(string: 'Error saat import: ' . $e->getMessage());
            return self::FAILURE;
        }

        fclose($handle);

        $this->info("Selesai.");
        $summary  = "=== RINGKASAN ===\n";
        $summary .= "Baris diproses   : {$baris}\n";
        $summary .= "Berhasil         : {$berhasil}\n";
        $summary .= "Skip duplikat    : {$skipDuplikat}\n";
        $summary .= "Gagal kosong     : {$failKosong}\n";
        $summary .= "Gagal mahasiswa  : {$failMhs}\n";
        $summary .= "Gagal ujian      : {$failUjian}\n";
        $summary .= "Gagal dosen      : {$failDosen}\n";
        $summary .= "Gagal komponen   : {$failKomponen}\n";
        file_put_contents($this->logPath, "\n" . $summary, FILE_APPEND);
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

    /**
     * Build in-memory indexes for dosen and mahasiswa.
     */
    protected function buildIndexes(): void
    {
        $this->info('Memuat data dosen & mahasiswa untuk cache...');

        $this->dosenIndex = [];
        $this->mahasiswaIndex = [];

        foreach (Dosen::all() as $dosen) {
            $key = $this->normalizeName($dosen->nama);
            if (! isset($this->dosenIndex[$key])) {
                $this->dosenIndex[$key] = $dosen;
            }
        }
        $this->info('Cache dosen terbuat: ' . count($this->dosenIndex) . ' record');

        foreach (Mahasiswa::all() as $mhs) {
            $key = $this->normalizeName($mhs->nama);
            if (! isset($this->mahasiswaIndex[$key])) {
                $this->mahasiswaIndex[$key] = $mhs;
            }
        }
        $this->info('Cache mahasiswa terbuat: ' . count($this->mahasiswaIndex) . ' record');
    }

    /**
     * Normalize name: lowercase, remove spaces, punctuation.
     */
    protected function normalizeName(string $name): string
    {
        $name = mb_strtolower($name, 'UTF-8');
        // buang semua karakter non-alfanumerik
        $name = preg_replace('/[^a-z0-9]/u', '', $name) ?? '';
        return $name;
    }

    /**
     * Find Mahasiswa by name using normalized index + simple fuzzy match.
     */
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

    /**
     * Find Dosen by name using normalized index + simple fuzzy match.
     */
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
