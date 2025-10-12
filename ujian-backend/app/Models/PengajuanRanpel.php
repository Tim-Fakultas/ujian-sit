<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanRanpel extends Model
{
    /** @use HasFactory<\Database\Factories\PengajuanRanpelFactory> */
    use HasFactory;

    protected $table = 'pengajuan_ranpel';

    protected $fillable = [
        'ranpel_id',
        'mahasiswa_id',
        'tanggal_pengajuan',
        'tanggal_diterima',
        'status',
        'keterangan',
    ];

    public function ranpel()
    {
        return $this->belongsTo(Ranpel::class, 'ranpel_id');
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }
}
