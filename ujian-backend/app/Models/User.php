<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * User — Model autentikasi pengguna.
 *
 * Login menggunakan `nip_nim` (NIP untuk dosen, NIM untuk mahasiswa)
 * sebagai identifier unik, bukan email.
 * Menggunakan Spatie Permission untuk manajemen role & permission.
 *
 * @property int         $id
 * @property string      $nip_nim   NIP (dosen) atau NIM (mahasiswa)
 * @property string      $nama
 * @property string|null $email
 * @property string      $password
 * @property int|null    $prodi_id  Untuk role kaprodi/sekprodi
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'nip_nim',
        'nama',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * Gunakan `nip_nim` sebagai identifier autentikasi (bukan `id` atau `email`).
     */
    public function getAuthIdentifierName()
    {
        return 'nip_nim';
    }

    // ========================================================================
    // RELASI
    // ========================================================================

    /** Data mahasiswa terkait (jika user adalah mahasiswa). */
    public function mahasiswa()
    {
        return $this->hasOne(Mahasiswa::class, 'user_id');
    }

    /** Data dosen terkait (jika user adalah dosen). */
    public function dosen()
    {
        return $this->hasOne(Dosen::class, 'user_id');
    }

    /** Program studi (untuk role kaprodi/sekprodi). */
    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    /** Verifikasi pemenuhan syarat yang dilakukan user ini. */
    public function verifications()
    {
        return $this->hasMany(PemenuhanSyarat::class, 'verified_by');
    }
}
