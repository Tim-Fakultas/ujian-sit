<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Prodi;
use App\Models\PengajuanJudul;

class Mahasiswa extends Model
{
    /** @use HasFactory<\Database\Factories\MahasiswaFactory> */
    use HasFactory;

    protected $table = "mahasiswa";
    protected $primaryKey = "id";
    protected $fillable = [
        'nim',
        'nama',
        'no_hp',
        'alamat',
        'prodi_id',
    ];

    public function pengajuanJudul(){
        return $this->hasMany(PengajuanJudul::class, 'mahasiswa_id', 'id');
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

}
