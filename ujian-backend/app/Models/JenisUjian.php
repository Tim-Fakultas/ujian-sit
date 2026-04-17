<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * JenisUjian — Jenis ujian yang tersedia.
 *
 * Contoh: Seminar Proposal, Ujian Hasil, Ujian Skripsi.
 *
 * @property int         $id
 * @property string      $nama_jenis
 * @property string|null $deskripsi
 * @property bool        $aktif
 */
class JenisUjian extends Model
{
    use HasFactory;

    protected $table = 'jenis_ujian';

    protected $fillable = ['nama_jenis', 'deskripsi', 'aktif'];

    /** Daftar pendaftaran ujian untuk jenis ini. */
    public function pendaftaranUjian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'jenis_ujian_id');
    }

    /** Syarat-syarat yang harus dipenuhi untuk jenis ujian ini. */
    public function syarat()
    {
        return $this->hasMany(Syarat::class, 'jenis_ujian_id');
    }

    /** Komponen penilaian beserta bobot untuk jenis ujian ini. */
    public function komponenPenilaian()
    {
        return $this->hasMany(KomponenPenilaian::class, 'jenis_ujian_id');
    }

    /** Template dokumen (Berita Acara, dll) untuk jenis ujian ini. */
    public function template()
    {
        return $this->hasMany(Template::class, 'jenis_ujian_id');
    }

    /** Daftar ujian yang dilaksanakan untuk jenis ini. */
    public function ujian()
    {
        return $this->hasMany(Ujian::class, 'jenis_ujian_id');
    }
}
