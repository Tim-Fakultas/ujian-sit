<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pejabat extends Model
{
    /** @use HasFactory<\Database\Factories\PejabatFactory> */
    use HasFactory;

    protected $table = "pejabat";
    
    protected $fillable = [
        'nama_pejabat',
        'jabatan',
        'no_hp',
    ];


}
