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
        'judulPenelitian' => 'string',
    ];

    public function skripsi()
    {
        return $this->hasOne(Skripsi::class, 'ranpel_id');
    }

    public function pengajuanRanpel()
    {
        return $this->hasOne(PengajuanRanpel::class, 'ranpel_id');
    }

    public function pendaftaranUjian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'ranpel_id');
    }
}
