<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ranpel extends Model
{
    /** @use HasFactory<\Database\Factories\RanpelFactory> */
    use HasFactory;

    protected $table = 'ranpel';

    protected $fillable = [
        'judul_penelitian',
        'masalah_dan_penyebab',
        'alternatif_solusi',
        'metode_penelitian',
        'hasil_yang_diharapkan',
        'kebutuhan_data',
    ];

    protected $casts = [
        'judul_penelitian' => 'string',
        'created_at' => 'datetime',
        'updated_at'=> 'datetime',
    ];

    public function pengajuanRanpel()
    {
        return $this->hasOne(PengajuanRanpel::class, 'ranpel_id');
    }

    public function pendaftaranUjian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'ranpel_id');
    }

    public function perbaikanJudul()
    {
        return $this->hasMany(PerbaikanJudul::class, 'ranpel_id');
    }

    public function perbaikanJudulTerakhirDiterima()
    {
        return $this->hasOne(PerbaikanJudul::class, 'ranpel_id')
                    ->where('status', 'diterima')
                    ->orderByDesc('tanggal_diterima')
                    ->orderByDesc('id');
    }

    public function getJudulAktifAttribute()
    {
        $perbaikanJudul = $this->perbaikanJudulTerakhirDiterima;

        return $perbaikanJudul ?->judul_baru ?? $this->judul_penelitian;
    }
}
