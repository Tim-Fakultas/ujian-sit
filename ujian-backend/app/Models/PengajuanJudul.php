<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanJudul extends Model
{
    /** @use HasFactory<\Database\Factories\PengajuanJudulFactory> */
    use HasFactory;

    protected $table = "pengajuan_judul";
    protected $primaryKey = "id";

    protected $fillable = [
        'mahasiswa_id',
        'dosen_id',
        'judul_skripsi',
        'deskripsi',
        'tanggal_pengajuan',
        'tanggal_disetujui',
        'status',
        'keterangan',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function skripsi()
    {
    return $this->hasOne(Skripsi::class, 'pengajuan_judul_id', 'id');
    }
    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }

    public function ranpel(){
        return $this->hasOne(Ranpel::class, 'pengajuan_judul_id', 'id');
    }
}
