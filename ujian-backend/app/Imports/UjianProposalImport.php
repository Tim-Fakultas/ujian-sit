<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\Ranpel;
use App\Models\PengajuanRanpel;
use App\Models\PendaftaranUjian;
use App\Models\Ujian;
use App\Models\JenisUjian;
use App\Models\Ruangan;
use App\Models\Dosen;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UjianProposalImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        // hapus header
        $rows->shift();

        DB::beginTransaction();

        try {
            foreach ($rows as $index => $row) {
                try {
                    $bulanMap = [
                        'Januari' => 'January',
                        'Februari' => 'February',
                        'Maret' => 'March',
                        'April' => 'April',
                        'Mei' => 'May',
                        'Juni' => 'June',
                        'Juli' => 'July',
                        'Agustus' => 'August',
                        'September' => 'September',
                        'Oktober' => 'October',
                        'November' => 'November',
                        'Desember' => 'December',
                    ];
                    // ========== Mapping Kolom dari Excel ==========
                    $hari = trim($row[0]);
                    $tanggal = trim($row[1]);
                    $bulan = trim($row[2]);
                    $tahun = trim($row[3]);
                    $waktu = trim($row[4]);
                    $namaMahasiswa = trim($row[5]);
                    $nim = trim($row[6]);
                    $prodi = trim($row[7]);
                    $judulExcel = trim($row[8]);
                    $ketuaNama = trim($row[9]);
                    $sekretarisNama = trim($row[12]);
                    $penguji1Nama = trim($row[15]);
                    $penguji2Nama = trim($row[18]);
                    $ruanganNamaRaw = trim($row[23]);

                    // ========== Parsing waktu ==========
                    $waktuMulai = null;
                    $waktuSelesai = null;
                    if (preg_match('/(\d{1,2}\.\d{2})-(\d{1,2}\.\d{2})/', $waktu, $matches)) {
                        $waktuMulai = str_replace('.', ':', $matches[1]);
                        $waktuSelesai = str_replace('.', ':', $matches[2]);
                    }

                    // ========== Parsing tanggal ==========
                    try {
                        $bulanEn = $bulanMap[$bulan] ?? $bulan;
                        $jadwal = Carbon::createFromFormat('d F Y', "$tanggal $bulanEn $tahun");
                    } catch (Exception $e) {
                        // fallback kalau format salah
                        $jadwal = Carbon::parse("$tahun-$bulan-$tanggal");
                    }

                    // ========== Cari Mahasiswa ==========
                    $mahasiswa = Mahasiswa::where('nim', $nim)->first();
                    if (!$mahasiswa) {
                        Log::warning("Mahasiswa tidak ditemukan: $nim - $namaMahasiswa");
                        continue;
                    }

                    // ========== Buat Ranpel ==========
                    $ranpel = Ranpel::firstOrCreate(
                        ['judul_penelitian' => 'Belum diinput'],
                        ['created_at' => now(), 'updated_at' => now()]
                    );

                    // ========== Buat Pengajuan Ranpel ==========
                    $pengajuan = PengajuanRanpel::firstOrCreate([
                        'ranpel_id' => $ranpel->id,
                        'mahasiswa_id' => $mahasiswa->id,
                    ], [
                        'tanggal_pengajuan' => now(),
                        'tanggal_diterima' => now(),
                        'status' => 'diterima',
                    ]);

                    // ========== Jenis Ujian ==========
                    $jenisUjian = JenisUjian::where('nama_jenis', 'Ujian Proposal')->first();
                    $jenisUjianId = $jenisUjian ? $jenisUjian->id : 1;

                    // ========== Pendaftaran Ujian ==========
                    $pendaftaran = PendaftaranUjian::create([
                        'mahasiswa_id' => $mahasiswa->id,
                        'ranpel_id' => $ranpel->id,
                        'jenis_ujian_id' => $jenisUjianId,
                        'tanggal_pengajuan' => now(),
                        'tanggal_disetujui' => now(),
                        'status' => 'selesai',
                    ]);

                    // ========== Dosen & Ruangan ==========
                    $ruanganNama = strtoupper(preg_replace('/\s+/', '', str_replace(['RUANG', 'Ruang', 'ruangan'], '', $ruanganNamaRaw)));
                    $ruangan = null;
                    if ($ruanganNama) {
                        // Cari ruangan di DB, ignore spasi & case
                        $ruangan = Ruangan::whereRaw("REPLACE(UPPER(nama_ruangan), ' ', '') LIKE ?", ["%{$ruanganNama}%"])->first();

                        if ($ruangan) {
                            Log::info('✅ Ruangan cocok', [
                                'excel' => $ruanganNamaRaw,
                                'normalized' => $ruanganNama,
                                'db' => $ruangan->nama_ruangan,
                            ]);
                        } else {
                            Log::warning('⚠️ Ruangan tidak ditemukan', [
                                'excel' => $ruanganNamaRaw,
                                'normalized' => $ruanganNama,
                            ]);
                        }
                    }
                    $ketua = $ketuaNama ? Dosen::where('nama', 'like', "%$ketuaNama%")->first() : null;
                    $sekretaris = $sekretarisNama ? Dosen::where('nama', 'like', "%$sekretarisNama%")->first() : null;
                    $penguji1 = $penguji1Nama ? Dosen::where('nama', 'like', "%$penguji1Nama%")->first() : null;
                    $penguji2 = $penguji2Nama ? Dosen::where('nama', 'like', "%$penguji2Nama%")->first() : null;

                    // ====ubah hari =====
                    $hariNormalized = strtolower(str_replace(["'", "’"], '', $hari)); // hilangkan tanda petik
                    // ========== Buat Ujian ==========
                    Ujian::create([
                        'pendaftaran_ujian_id' => $pendaftaran->id,
                        'mahasiswa_id' => $mahasiswa->id,
                        'jenis_ujian_id' => $jenisUjianId,
                        'hari_ujian' => strtolower($hariNormalized),
                        'jadwal_ujian' => $jadwal,
                        'waktu_mulai' => $waktuMulai,
                        'waktu_selesai' => $waktuSelesai,
                        'ruangan_id' => $ruangan?->id,
                        'ketua_penguji' => $ketua?->id,
                        'sekretaris_penguji' => $sekretaris?->id,
                        'penguji_1' => $penguji1?->id,
                        'penguji_2' => $penguji2?->id,
                    ]);
                } catch (Exception $e) {
                    Log::error("Gagal import baris ke-{$index}: " . $e->getMessage());
                    continue;
                }
            }

            DB::commit();
            Log::info("CREATE UJIAN", ['nim' => $nim, 'hari' => $hari, 'pendaftaran_id' => $pendaftaran->id ?? null]);

            Log::info('✅ Import data ujian seminar proposal berhasil!');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('❌ Import dibatalkan: ' . $e->getMessage());
        }
    }
}
