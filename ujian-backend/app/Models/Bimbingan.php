<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bimbingan extends Model
{
    /** @use HasFactory<\Database\Factories\BimbinganFactory> */
    use HasFactory;

    protected $table = "bimbingan";

    protected $fillable = [
        'id_pengajuan',
        'tanggal_bimbingan',
        'catatan',
        'status',
    ];


    public function mahasiswa(){
        return $this->belongsTo(Mahasiswa::class);
    }

    public function skripsi(){
        return $this->belongsTo(Skripsi::class);
    }

    public function pembimbing1(){
        return $this->belongsTo(Dosen::class, 'pembimbing_1');
    }
    
    public function pembimbing2(){
        return $this->belongsTo(Dosen::class, 'pembimbing_2');
    }
}
