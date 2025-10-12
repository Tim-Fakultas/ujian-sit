<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendaftaranUjian extends Model
{
    /** @use HasFactory<\Database\Factories\PendaftaranUjianFactory> */
    use HasFactory;

    protected $table = 'pendaftaran_ujian';

    protected $fillable = [
        'mahasiswa_id',
        'ranpel_id',
        'jenis_ujian_id',
        'tanggal_pengajuan',
        'tanggal_disetujui',
        'status',
        'keterangan',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function jenis_ujian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }

    public function ujian()
    {
        return $this->hasOne(Ujian::class, 'pendaftaran_ujian_id');
    }

    public function skripsi()
    {
        return $this->belongsTo(Skripsi::class, 'skripsi_id');
    }

    public function pemenuhan_syarat()
    {
        return $this->hasMany(PemenuhanSyarat::class, 'pendaftaran_ujian_id');
    }

    public function ranpel()
    {
        return $this->belongsTo(Ranpel::class, 'ranpel_id');
    }

    public function berkas()
    {
        return $this->hasMany(Berkas::class, 'pendaftaran_ujian_id');
    }

    protected static function booted()
{
    static::updating(function ($pendaftaran) {
        if ($pendaftaran->isDirty('status') && $pendaftaran->status === 'dijadwalkan') {
            Ujian::create([
                'pendaftaran_ujian_id' => $pendaftaran->id,
                'jenis_ujian_id' => $pendaftaran->jenis_ujian_id,
                'mahasiswa_id' => $pendaftaran->mahasiswa_id,
                'ranpel_id' => $pendaftaran->ranpel_id,
                'ketua_penguji' => $pendaftaran->mahasiswa->pembimbing_1,
                'sekretaris_penguji' => $pendaftaran->mahasiswa->pembimbing_2,
            ]);
        }
    });
}
}
