<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Judul extends Model
{
    /** @use HasFactory<\Database\Factories\JudulFactory> */
    use HasFactory;

    protected $table = "judul";

    protected $fillable = [
        'judul',
        'deskripsi',
    ];

    public function ranpel(){
        return $this->hasMany(Ranpel::class, 'judul_id');
    }
}
