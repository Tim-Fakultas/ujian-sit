<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ranpel;
use App\Models\PerbaikanJudul;


class PendaftaranUjian extends Model
{
    /** @use HasFactory<\Database\Factories\PendaftaranUjianFactory> */
    use HasFactory;

    protected $table = 'pendaftaran_ujian';

    protected $fillable = [
        'mahasiswa_id',
        'ranpel_id',
        'jenis_ujian_id',
        'perbaikan_judul_id',
        'judul_snapshot',
        'tanggal_pengajuan',
        'tanggal_disetujui',
        'status',
        'keterangan',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function jenisUjian()
    {
        return $this->belongsTo(JenisUjian::class, 'jenis_ujian_id');
    }

    public function ujian()
    {
        return $this->hasOne(Ujian::class, 'pendaftaran_ujian_id');
    }

    public function pemenuhanSyarat()
    {
        return $this->hasMany(PemenuhanSyarat::class, 'pendaftaran_ujian_id');
    }

    public function ranpel()
    {
        return $this->belongsTo(Ranpel::class, 'ranpel_id');
    }

    public function berkas()
    {
        return $this->hasMany(Berkas::class, 'pendaftaran_ujian_id');
    }

    public function perbaikanJudul()
    {
        return $this->belongsTo(PerbaikanJudul::class, 'perbaikan_judul_id');
    }

    protected static function booted()
    {

        static::creating(function ($pendaftaran) {
            if (empty($pendaftaran->tanggal_pengajuan)) {
                $pendaftaran->tanggal_pengajuan = now()->toDateTimeString();
            }

            if(empty($pendaftaran->judul_snapshot)){
                $ranpel = Ranpel::find($pendaftaran->ranpel_id);

                if($ranpel) {
                    $pj = PerbaikanJudul::query()
                        ->where('mahasiswa_id', $pendaftaran->mahasiswa_id)
                        ->where('ranpel_id', $ranpel->id)
                        ->where('status', 'diterima')
                        ->orderByDesc('tanggal_diterima')
                        ->orderByDesc('id')
                        ->first();

                    $pendaftaran->perbaikan_judul_id = $pj?->id;
                    $pendaftaran->judul_snapshot = $pj?->judul_baru ?? $ranpel->judul_penelitian;
                }

            }

            if ($pendaftaran->status === 'belum dijadwalkan' && empty($pendaftaran->tanggal_disetujui)) {
                $pendaftaran->tanggal_disetujui = now()->toDateTimeString();
            }


        });
        static::updating(function ($pendaftaran){

            if(!($pendaftaran->isDirty('status') && ($pendaftaran->status=='belum dijadwalkan'))){
                return;
            }

            DB::transaction(function () use ($pendaftaran){

                if(empty($pendaftaran->tanggal_disetujui)){
                    $pendaftaran->tanggal_disetujui = now()->toDateTimeString();
                }

                $ujian = Ujian::firstOrCreate([
                    'pendaftaran_ujian_id' => $pendaftaran->id,
                ],
                    [
                    'jenis_ujian_id' => $pendaftaran->jenis_ujian_id,
                    'mahasiswa_id' => $pendaftaran->mahasiswa_id
                ]);

                $mahasiswa = $pendaftaran->mahasiswa()->with(['pembimbing1', 'pembimbing2'])->first();

                if($mahasiswa?->pembimbing1){
                    PengujiUjian::updateOrCreate([
                        'ujian_id' => $ujian->id,
                        'peran' => 'ketua_penguji',
                    ],
                [
                    'dosen_id'=>$mahasiswa->pembimbing1->id,
                ]);
                }

                if($mahasiswa?->pembimbing2){
                    PengujiUjian::updateOrCreate(
                    [
                        'ujian_id' => $ujian->id,
                        'peran' => 'sekretaris_penguji',
                    ],
                    [
                        'dosen_id'=>$mahasiswa->pembimbing2->id,
                    ]);
                }
            });
        });

    }

}
