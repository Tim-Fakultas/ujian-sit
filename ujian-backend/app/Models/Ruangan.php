<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruangan extends Model
{
    /** @use HasFactory<\Database\Factories\RuanganFactory> */
    use HasFactory;

    protected $table = 'ruangan';

    protected $fillable = [
        'prodi_id',
        'nama_ruangan',
    ];

    protected $guarded = [
        'created_at',
        'updated_at',
    ];

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }

    public function ujian()
    {
        return $this->hasMany(Ujian::class, 'ruangan_id');
    }
}
