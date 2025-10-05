<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skripsi extends Model
{
    /** @use HasFactory<\Database\Factories\SkripsiFactory> */
    use HasFactory;

    protected $table = 'skripsi';

    protected $fillable = [
        'mahasiswa_id',
        'ranpel_id',
        'judul',
        'pembimbing_1',
        'pembimbing_2',
        'status',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function ranpel()
    {
        return $this->belongsTo(Ranpel::class, 'ranpel_id');
    }

    public function bimbingan()
    {
        return $this->hasMany(Bimbingan::class, 'skripsi_id');
    }

    public function pendaftaran_ujian()
    {
        return $this->hasMany(PendaftaranUjian::class, 'skripsi_id');
    }

    public function pembimbing_1()
    {
        return $this->belongsTo(Dosen::class, 'pembimbing_1');
    }

    public function pembimbing_2()
    {
        return $this->belongsTo(Dosen::class, 'pembimbing_1');
    }
}
