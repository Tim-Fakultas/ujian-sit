<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Mahasiswa — Representasi data mahasiswa.
 *
 * Terhubung ke: prodi, peminatan, dosen PA, pembimbing 1 & 2,
 * user account, ujian, pendaftaran ujian, pengajuan ranpel, dll.
 *
 * @property int         $id
 * @property string      $nim
 * @property string      $nama
 * @property string|null $no_hp
 * @property string|null $alamat
 * @property int|null    $prodi_id
 * @property int|null    $peminatan_id
 * @property int|null    $semester
 * @property float|null  $ipk
 * @property int|null    $dosen_pa       FK ke tabel dosen
 * @property int|null    $pembimbing_1   FK ke tabel dosen
 * @property int|null    $pembimbing_2   FK ke tabel dosen
 * @property string|null $status         Aktif, Cuti, Lulus, dll
 * @property string|null $angkatan
 * @property int|null    $user_id
 * @property string|null $url_ktm
 * @property string|null $url_transkrip_nilai
 * @property string|null $url_bukti_lulus_metopen
 * @property string|null $url_sertifikat_bta
 */
class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa';

    protected $fillable = [
        'nim', 'nama', 'no_hp', 'alamat', 'prodi_id', 'peminatan_id',
        'semester', 'ipk', 'dosen_pa', 'pembimbing_1', 'pembimbing_2',
        'status', 'angkatan', 'user_id', 'url_ktm', 'url_transkrip_nilai',
        'url_bukti_lulus_metopen', 'url_sertifikat_bta',
    ];

    protected $casts = [
        'ipk'      => 'float',
        'semester' => 'integer',
        'status'   => 'string',
        'angkatan' => 'string',
    ];

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Program studi mahasiswa. */
    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    /** Peminatan/konsentrasi mahasiswa. */
    public function peminatan()
    {
        return $this->belongsTo(Peminatan::class, 'peminatan_id');
    }

    /** Dosen Pembimbing Akademik (PA). */
    public function dosenPembimbingAkademik()
    {
        return $this->belongsTo(Dosen::class, 'dosen_pa');
    }

    /** Pembimbing skripsi 1. */
    public function pembimbing1()
    {
        return $this->belongsTo(Dosen::class, 'pembimbing_1');
    }

    /** Pembimbing skripsi 2. */
    public function pembimbing2()
    {
        return $this->belongsTo(Dosen::class, 'pembimbing_2');
    }

    /** Akun user untuk login. */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Daftar ujian yang diikuti. */
    public function ujian()
    {
        return $this->hasMany(Ujian::class, 'mahasiswa_id');
    }

    /** Daftar pendaftaran ujian. */
    public function pendaftaranUjian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'mahasiswa_id');
    }

    /** Daftar pengajuan rancangan penelitian. */
    public function pengajuanRanpel()
    {
        return $this->hasMany(PengajuanRanpel::class, 'mahasiswa_id');
    }

    /** Daftar perbaikan judul penelitian. */
    public function perbaikanJudul()
    {
        return $this->hasMany(PerbaikanJudul::class, 'mahasiswa_id');
    }
}
