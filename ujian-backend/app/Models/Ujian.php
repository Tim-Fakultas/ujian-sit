<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Ujian — Representasi data ujian mahasiswa.
 *
 * Mencakup: Seminar Proposal, Ujian Hasil, Ujian Skripsi.
 * Setiap ujian terhubung ke pendaftaran ujian, dosen penguji (pivot),
 * penilaian, ruangan, dan keputusan.
 *
 * @property int         $id
 * @property int         $pendaftaran_ujian_id
 * @property int         $mahasiswa_id
 * @property int         $jenis_ujian_id
 * @property string|null $hari_ujian    Hari pelaksanaan ujian (otomatis capitalize)
 * @property string|null $jadwal_ujian  Tanggal ujian
 * @property string|null $waktu_mulai
 * @property string|null $waktu_selesai
 * @property int|null    $ruangan_id
 * @property int|null    $keputusan_id
 * @property string|null $hasil         "lulus" atau "tidak lulus"
 * @property float|null  $nilai_akhir   Rata-rata tertimbang dari penilaian penguji
 * @property string|null $catatan
 */
class Ujian extends Model
{
    use HasFactory;

    protected $table = 'ujian';

    protected $fillable = [
        'pendaftaran_ujian_id',
        'mahasiswa_id',
        'jenis_ujian_id',
        'hari_ujian',
        'jadwal_ujian',
        'waktu_mulai',
        'waktu_selesai',
        'ruangan_id',
        'keputusan_id',
        'hasil',
        'nilai_akhir',
        'catatan',
    ];

    /**
     * Accessor/mutator: capitalize otomatis untuk hari ujian.
     */
    protected function hariUjian(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => $value ? ucfirst($value) : $value,
            set: fn(?string $value) => $value ? ucfirst($value) : $value,
        );
    }

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Pendaftaran ujian yang menghasilkan jadwal ujian ini. */
    public function pendaftaranUjian()
    {
        return $this->belongsTo(PendaftaranUjian::class, 'pendaftaran_ujian_id');
    }

    /** Dosen penguji (many-to-many) melalui pivot `penguji_ujian`. */
    public function dosenPenguji()
    {
        return $this->belongsToMany(Dosen::class, 'penguji_ujian', 'ujian_id', 'dosen_id')
            ->withPivot('peran')
            ->withTimestamps();
    }

    /** Record penguji ujian (one-to-many). */
    public function pengujiUjian()
    {
        return $this->hasMany(PengujiUjian::class, 'dosen_id');
    }

    /** Jenis ujian (Seminar Proposal / Ujian Hasil / Ujian Skripsi). */
    public function jenisUjian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }

    /** Mahasiswa yang diuji. */
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    /** Daftar penilaian dari setiap dosen penguji. */
    public function penilaian()
    {
        return $this->hasMany(Penilaian::class, 'ujian_id');
    }

    /** Ruangan tempat ujian berlangsung. */
    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class, 'ruangan_id');
    }

    /** Daftar kehadiran dosen pada ujian ini. */
    public function daftarKehadiran()
    {
        return $this->hasMany(DaftarKehadiran::class, 'ujian_id');
    }

    /** Keputusan sidang. */
    public function keputusan()
    {
        return $this->belongsTo(Keputusan::class, 'keputusan_id');
    }

    // ========================================================================
    // BUSINESS LOGIC
    // ========================================================================

    /**
     * Hitung nilai akhir ujian berdasarkan rata-rata tertimbang penilaian.
     *
     * Logika:
     * 1. Hitung total per dosen = SUM(nilai × bobot) / SUM(bobot)
     * 2. Nilai akhir = AVG dari total semua dosen
     * 3. Lulus jika nilai >= 70
     * 4. Khusus Proposal/Hasil/Skripsi: jika ada nilai <= 60, otomatis tidak lulus
     *
     * @return self|null  null jika belum ada data penilaian
     */
    public function hitungNilaiAkhir(): ?self
    {
        // Hitung total tertimbang per dosen
        $subQuery = $this->penilaian()
            ->getQuery()
            ->join('komponen_penilaian', 'penilaian.komponen_penilaian_id', '=', 'komponen_penilaian.id')
            ->selectRaw('
                penilaian.dosen_id,
                (SUM(penilaian.nilai * komponen_penilaian.bobot) * 1.0)
                / NULLIF(SUM(komponen_penilaian.bobot), 0) AS total
            ')
            ->groupBy('penilaian.dosen_id');

        // Rata-rata dari semua dosen
        $rataRata = DB::query()
            ->fromSub($subQuery, 't')
            ->avg('t.total');

        if ($rataRata === null) {
            return null;
        }

        $nilaiAkhir = (float) $rataRata;
        $isLulus = $nilaiAkhir >= 70;

        // Aturan tambahan: jika ada komponen bernilai <= 60, maka tidak lulus
        // Berlaku untuk: Seminar Proposal, Ujian Hasil, Ujian Skripsi
        $jenisUjian = $this->jenisUjian;
        if ($jenisUjian) {
            $namaLower = strtolower($jenisUjian->nama_jenis ?? '');
            $targetExams = ['proposal', 'hasil', 'skripsi'];

            $isTargetExam = collect($targetExams)->contains(
                fn($target) => str_contains($namaLower, $target)
            );

            if ($isTargetExam && $this->penilaian()->where('nilai', '<=', 60)->exists()) {
                $isLulus = false;
            }
        }

        $this->update([
            'nilai_akhir' => $nilaiAkhir,
            'hasil'       => $isLulus ? 'lulus' : 'tidak lulus',
        ]);

        return $this;
    }

    // ========================================================================
    // MODEL EVENTS
    // ========================================================================

    protected static function booted()
    {
        // Saat jadwal diisi, otomatis update status pendaftaran ke "dijadwalkan"
        static::updating(function ($ujian) {
            if ($ujian->isDirty('jadwal_ujian') && !empty($ujian->jadwal_ujian)) {
                $ujian->pendaftaranUjian()->update(['status' => 'dijadwalkan']);
            }
        });
    }
}
