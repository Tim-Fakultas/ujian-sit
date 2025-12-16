<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerbaikanJudul extends Model
{
    /** @use HasFactory<\Database\Factories\PerbaikanJudulFactory> */
    use HasFactory;

    protected $table = "perbaikan_judul";
    protected $fillable = [
        'ranpel_id',
        'mahasiswa_id',
        'judul_lama',
        'judul_baru',
        'berkas',
        'status',
        'tanggal_perbaikan',
        'tanggal_diterima',
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
