<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanRanpel extends Model
{
    /** @use HasFactory<\Database\Factories\PengajuanRanpelFactory> */
    use HasFactory;

    protected $table = 'pengajuan_ranpel';

    protected $fillable = [
        'ranpel_id',
        'mahasiswa_id',
        'tanggal_pengajuan',
        'tanggal_diterima',
        'tanggal_diverifikasi',
        'tanggal_ditolak',
        'status',
        'keterangan',
        'catatan_kaprodi',
    ];

    protected static function booted()
    {
        static::creating(function ($pengajuan) {
            if (empty($pengajuan->tanggal_pengajuan)) {
                $pengajuan->tanggal_pengajuan = now();
            }
        });

        static::updating(function ($pengajuan) {
            if ($pengajuan->isDirty('status')) {
                if ($pengajuan->status === 'diterima') {
                    $pengajuan->tanggal_diterima = now();
                }
                if ($pengajuan->status === 'diverifikasi') {
                    $pengajuan->tanggal_diverifikasi = now();
                }
                if ($pengajuan->status === 'ditolak') {
                    $pengajuan->tanggal_ditolak = now();
                }
            }
        });
    }


    public function ranpel()
    {
        return $this->belongsTo(Ranpel::class, 'ranpel_id');
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'proposal_id');
    }
}
