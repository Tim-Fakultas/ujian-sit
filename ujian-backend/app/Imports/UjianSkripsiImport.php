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
                    $ruanganNama = trim($row[25]);

                    // ========== Parsing tanggal ==========
                    try {
                        $bulanEn = $bulanMap[$bulan] ?? $bulan;
                        $jadwal = Carbon::createFromFormat('d F Y', "$tanggal $bulanEn $tahun");
                    } catch (Exception $e) {
                        $jadwal = Carbon::parse("$tahun-$bulanEn-$tanggal");
                    }

                    $mahasiswa = Mahasiswa::where('nim', $nim)->first();
                    if(!$mahasiswa){
                        Log::warning("Mahasiswa tidak ditemukan dengan:$nim, $namaMahasiswa");
                        continue;
                    }

                    $ranpel = Ranpel::firstOrCreate([
                        'judul_penelitian'=>$judulPenelitian,
                        'created_at'=>now(),
                        'updated_at'=>now(),
                    ]);

                    $pengajuanRanpel = PengajuanRanpel::firstOrCreate([
                        'ranpel_id' => $ranpel->id,
                        'mahasiswa_id' => $mahasiswa->id,
                    ],[
                        'tanggal_pengajuan'=>now(),
                        'tanggal_disetujui'=>now(),
                        'status'=>'diterima',
                        'created_at'=>now(),
                        'updated_at'=>now(),
                    ]);

                    $jenisUjian = JenisUjian::where('id', 3)->first();
                    $jenisUjianId = $jenisUjian ? $jenisUjian->id : null;

                    $pendaftaran = PendaftaranUjian::create([
                        'mahasiswa_id'=>$mahasiswa->id,
                        'ranpel_id'=>$ranpel->id,
                        'jenis_ujian_id'=>$jenisUjianId,
                        'tanggal_pengajuan'=>now(),
                        'tanggal_disetujui'=>now(),
                        'status'=>'selesai',
                        'created_at'=>now(),
                        'updated_at'=>now(),
                    ]);

                    $ruangan = $ruanganNama ? Ruangan::where('nama_ruangan', 'like', "%$ruanganNama%")->first() : null;
                    $ketua = $ketuaNama ? Dosen::where('nama', 'like', "%$ketuaNama%")->first() : null;
                    $sekretaris = $sekretarisNama ? Dosen::where('nama', 'like', "%$sekretarisNama%")->first():null;
                    $penguji1 = $penguji1Nama ? Dosen::where('nama', 'like', "%$penguji1Nama%")->first() : null;
                    $penguji2 = $penguji2Nama ? Dosen::where('nama', 'like', "%$penguji2Nama%")->first() : null;


                    $hariNormalized = strtolower(str_replace(["'","’"], '', $hari));
                    Ujian::create([
                        'pendaftaran_ujian_id'=>$pendaftaran->id,
                        'mahasiswa_id'=>$mahasiswa->id,
                        'jenis_ujian_id'=>$jenisUjianId,
                        'hari_ujian' => $hariNormalized,
                        'jadwal_ujian' => $jadwal,
                        'waktu_mulai' => $waktuMulai,
                        'waktu_selesai'=>$waktuSelesai,
                        'ruangan_id' => $ruangan?->id,
                        'ketua_penguji' => $ketua?->id,
                        'sekretaris_penguji' => $sekretaris?->id,
                        'penguji_1' => $penguji1?->id,
                        'penguji_2' => $penguji2?->id,
                    ]);

                    if (!$penguji2) {
                 Log::warning("Penguji 2 tidak ditemukan untuk NIM {$nim}: {$penguji2Nama}");
}

                } catch (Exception $e) {
                    Log::error("Gagal Import baris ke-{$index}:". $e->getMessage());
                    continue;
                }
            }

            DB::commit();
            Log::info("Import Ujian Skripsi selesai tanpa error.");
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Gagal import Ujian Skripsi: " . $e->getMessage());
        }
    }
}




/*
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

            $hari = trim($rows[0]);
            $tanggal = trim($rows[1]);
            $bulan = trim($rows[2]);$bulanEN = $bulanMap[$bulan] ?? $bulan;
            $tahun = trim($rows[3]);
            $waktuMulai = trim($rows[5]);
            $waktuSelesai = trim($rows[6]);
            $namaMahasiswa = trim($rows[7]);
            $nim = trim($rows[8]);
            $judulPenelitian = trim($rows[10]);
            $ketuaNama = trim($rows[11]);
            $sekretarisNama = trim($rows[14]);
            $penguji1Nama = trim($rows[17]);
            $penguji2Nama = trim($rows[20]);
            $ruanganNama = trim($rows[25]);

            try {
                $bulanEn = $bulanMap[$bulan] ?? $bulan;
                $jadwal = Carbon::createFromFormat('d F Y', "$tanggal $bulanEn $tahun");
            } catch (Exception $e) {
                $jadwal = Carbon::parse("$tahun-$bulan-$tanggal");
            }

            $mahasiswa = Mahasiswa::where('nim', $nim)->first();
            if (!$mahasiswa) {
                Log::warning("Mahasiswa dengan NIM $nim - $namaMahasiswa tidak ditemukan");
                return;
            }

            $ranpel = Ranpel::firstOrCreate(
                ['judul_penelitian' => $judulPenelitian,
                            'created_at' => now(),
                            'updated_at' => now(),
            ]);

            $pengajuanRanpel = PengajuanRanpel::firstOrCreate(
                [
                    'mahasiswa_id' => $mahasiswa->id,
                    'ranpel_id' => $ranpel->id,
                ],
                [
                    'tanggal_pengajuan' => now(),
                    'tanggal_disetujui' => now(),
                    'status' => 'diterima',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            $jenisUjian = JenisUjian::where('id', 3)->first();
            $jenisUjianId = $jenisUjian ? $jenisUjian->id : null;

            $pendaftaran = PendaftaranUjian::firstOrCreate(
                [
                    'mahasiswa_id' => $mahasiswa->id,
                    'jenis_ujian_id' => $jenisUjianId,
                    'ranpel_id' => $ranpel->id,
                    'tanggal_pengajuan'=>now(),
                    'tanggal_disetujui'=>now(),
                ],
                [
                    'status' => 'selesai',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            $ruangan = $ruanganNama ? Ruangan::where('nama_ruangan', 'like', "%$ruanganNama%")->first() : null;
            $ketua = $ketuaNama ? Dosen::where('nama', 'like', "%$ketuaNama%")->first() : null;
            $sekretaris = $sekretarisNama ? Dosen::where('nama', 'like', "%$sekretarisNama%")->first() : null;
            $penguji1 = $penguji1Nama ? Dosen::where('nama', 'like', "%$penguji1Nama%")->first() : null;
            $penguji2 = $penguji2Nama ? Dosen::where('nama', 'like', "%$penguji2Nama%")->first() : null;

            $hariNormalized = strtolower(str_replace(["'", "’"], '', $hari));

            Ujian::create([
                'pendaftaran_ujian_id' => $pendaftaran->id,
                'mahasiswa_id' => $mahasiswa->id,
                'jenis_ujian_id' => $jenisUjianId,
                'hari_ujian' => strtolower($hariNormalized),
                'jadwal_ujian' => $jadwal,
                'waktu_mulai' => $waktuMulai,
                'waktu_selesai' => $waktuSelesai,
                'ruangan_id' => $ruangan ? $ruangan->id : null,
                'dosen_ketua_id' => $ketua ? $ketua->id : null,
                'dosen_sekretaris_id' => $sekretaris ? $sekretaris->id : null,
                'dosen_penguji1_id' => $penguji1 ? $penguji1->id : null,
                'dosen_penguji2_id' => $penguji2 ? $penguji2->id : null,
                'status' => 'selesai',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
*/
