<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keputusan extends Model
{
    /** @use HasFactory<\Database\Factories\KeputusanFactory> */
    use HasFactory;

    protected $table = 'keputusan';

    public function ujian()
    {
        return $this->hasMany(Ujian::class);
    }
}
