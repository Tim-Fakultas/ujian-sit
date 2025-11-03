<?php


namespace App\Imports;

use App\Models\Dosen;
use App\Models\JenisUjian;
use App\Models\Mahasiswa;
use App\Models\PendaftaranUjian;
use App\Models\PengajuanRanpel;
use App\Models\Ranpel;
use App\Models\Ruangan;
use App\Models\Ujian;
use Carbon\Carbon;
use DB;
use Exception;
use Illuminate\Support\Collection;
use Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;

class UjianSkripsiImport implements ToCollection
{
    /**
    * @param array $row
    *
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function collection(Collection $rows){

        //hapus header
        $rows->shift();

        DB::beginTransaction();

        try {
            foreach ($rows as $index => $row){
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
                    $waktuMulai = str_replace('.', ':',trim($row[5]));
                    $waktuSelesai = str_replace('.',':',trim($row[6]));
                    $namaMahasiswa = trim($row[7]);
                    $nim = trim($row[8]);
                    $judulPenelitian = trim($row[10]);
                    $ketuaNama = trim($row[11]);
                    $sekretarisNama = trim($row[14]);
                    $penguji1Nama = trim($row[17]);
                    $penguji2Nama = trim($row[20]);
                    $ruanganNamaRaw = trim($row[25]);

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
                    $jenisUjian = JenisUjian::where('nama_jenis', 'Ujian Skripsi')->first();
                    $jenisUjianId = $jenisUjian ? $jenisUjian->id : 3;

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
                    Log::error("Gagal Import baris ke-{$index}:". $e->getMessage());
                    continue;
                }
            }

            DB::commit();
            Log::info("Import Ujian Skripsi selesai tanpa error.");
            Log::info("CREATE UJIAN", ['nim' => $nim, 'hari' => $hari, 'pendaftaran_id' => $pendaftaran->id ?? null]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Gagal import Ujian Skripsi: " . $e->getMessage());
        }
    }
}

