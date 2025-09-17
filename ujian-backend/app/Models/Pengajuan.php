<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengajuan extends Model
{
    /** @use HasFactory<\Database\Factories\PengajuanFactory> */
    use HasFactory;

    protected $table = "pengajuan";
    protected $primaryKey = "id_pengajuan";

    protected $fillable = [
        'id_mahasiswa',
        'id_dosen',
        'id_pejabat',
        'judul_skripsi',
        'tanggal_pengajuan',
        'tanggal_disetujui',
        'status',
        'keterangan',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function skripsi()
    {
    return $this->hasOne(Skripsi::class, 'pengajuan_id', 'id_pengajuan');
    }
    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'id_dosen');
    }

    public function pejabat()
    {
        return $this->belongsTo(Pejabat::class, 'id_pejabat');
    }
}
