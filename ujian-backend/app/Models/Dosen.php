<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Dosen — Representasi data dosen.
 *
 * Dosen memiliki berbagai peran: Pembimbing Akademik (PA),
 * Pembimbing Skripsi 1/2, dan Penguji Ujian.
 *
 * @property int         $id
 * @property string      $nama
 * @property string|null $nidn
 * @property string|null $nip
 * @property string|null $email
 * @property string|null $no_hp
 * @property string|null $alamat
 * @property string|null $tempat_tanggal_lahir
 * @property string|null $pangkat
 * @property string|null $golongan
 * @property \Carbon\Carbon|null $tmt_fst  Tanggal mulai tugas di FST
 * @property string|null $jabatan
 * @property int|null    $prodi_id
 * @property string|null $foto
 * @property int|null    $user_id
 * @property string|null $url_ttd   Path file tanda tangan digital
 */
class Dosen extends Model
{
    use HasFactory;

    protected $table = 'dosen';

    protected $fillable = [
        'nama', 'nidn', 'nip', 'email', 'no_hp', 'alamat',
        'tempat_tanggal_lahir', 'pangkat', 'golongan', 'tmt_fst',
        'jabatan', 'prodi_id', 'foto', 'user_id', 'url_ttd',
    ];

    protected $casts = [
        'tmt_fst' => 'datetime',
    ];

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Program studi dosen. */
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }

    /** Akun user untuk login. */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Daftar penilaian yang diberikan dosen. */
    public function penilaian()
    {
        return $this->hasMany(Penilaian::class, 'dosen_id');
    }

    /** Mahasiswa yang dibimbing sebagai Pembimbing 1. */
    public function mahasiswaBimbingan1()
    {
        return $this->hasMany(Mahasiswa::class, 'pembimbing_1');
    }

    /** Mahasiswa yang dibimbing sebagai Pembimbing 2. */
    public function mahasiswaBimbingan2()
    {
        return $this->hasMany(Mahasiswa::class, 'pembimbing_2');
    }

    /** Mahasiswa yang menjadi bimbingan PA. */
    public function mahasiswaPa()
    {
        return $this->hasMany(Mahasiswa::class, 'dosen_pa');
    }

    /** Ujian yang ditugaskan sebagai penguji (many-to-many). */
    public function ujian()
    {
        return $this->belongsToMany(Ujian::class, 'penguji_ujian', 'dosen_id', 'ujian_id')
            ->withPivot('peran')
            ->withTimestamps();
    }

    /** Record penguji ujian (one-to-many). */
    public function pengujiUjian()
    {
        return $this->hasMany(PengujiUjian::class, 'dosen_id');
    }

    /** Daftar kehadiran pada ujian. */
    public function daftarKehadiran()
    {
        return $this->hasMany(DaftarKehadiran::class, 'dosen_id');
    }
}
