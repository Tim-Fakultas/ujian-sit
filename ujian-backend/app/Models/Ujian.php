<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    /** @use HasFactory<\Database\Factories\UjianFactory> */
    use HasFactory;

    protected $table = "ujian";

    protected $fillable = [
        'pendaftaran_ujian_id',
        'jenis_ujian_id',
        'mahasiswa_id',
        'jadwal_ujian',
        'waktu_mulai',
        'waktu_selesai',
        'ruangan',
        'status',
        'hasil',
        'nilai',
        'created_by',
        'updated_by',
        'catatan',
    ];

    

       public function pendaftaran()
    {
        return $this->belongsTo(PendaftaranUjian::class, 'pendaftaran_ujian_id');
    }

    public function skripsi(){
        return $this->hasOneThrough(Skripsi::class, PendaftaranUjian::class, 'id', 'id', 'pendaftaran_ujian_id', 'skripsi_id');
    }

    public function jenisUjian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function penilaian()
    {
        return $this->hasMany(Penilaian::class, 'ujian_id');
    }
}
