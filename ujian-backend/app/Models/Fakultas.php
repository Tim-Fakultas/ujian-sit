<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Fakultas — Representasi data fakultas.
 *
 * @property int    $id
 * @property string $nama_fakultas
 */
class Fakultas extends Model
{
    use HasFactory;

    protected $table = 'fakultas';

    protected $fillable = ['nama_fakultas'];

    /** Daftar program studi di fakultas ini. */
    public function prodi()
    {
        return $this->hasMany(Prodi::class, 'fakultas_id');
    }
}
