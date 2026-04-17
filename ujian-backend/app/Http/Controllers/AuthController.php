<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * AuthController — Mengelola autentikasi pengguna.
 *
 * Menyediakan endpoint untuk login (via NIP/NIM + password),
 * logout (revoke token Sanctum), dan ubah password.
 */
class AuthController extends Controller
{
    /**
     * Login pengguna menggunakan NIP/NIM dan password.
     *
     * Mengembalikan token akses Sanctum beserta data pengguna
     * yang disesuaikan berdasarkan role (mahasiswa/dosen/admin).
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'nip_nim' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = [
            'nip_nim' => $request->nip_nim,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            $userData = $this->getUserDataByRole($user);
            $isDefaultPassword = Hash::check($request->nip_nim, $user->password);

            return response()->json([
                'message'             => 'Login berhasil',
                'success'             => true,
                'role'                => $user->getRoleNames()->first(),
                'roles'               => $user->getRoleNames(),
                'permissions'         => $user->getAllPermissions()->pluck('name'),
                'user'                => $userData,
                'is_default_password' => $isDefaultPassword,
                'access_token'        => $token,
                'token_type'          => 'Bearer',
            ], 200);
        }

        return response()->json(['message' => 'User tidak ditemukan'], 401);
    }

    /**
     * Ubah password pengguna yang sedang login.
     *
     * Memvalidasi password lama sebelum mengizinkan perubahan.
     * Password baru minimal 8 karakter dan harus dikonfirmasi.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Password saat ini tidak sesuai',
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diubah',
        ]);
    }

    /**
     * Ambil data pengguna berdasarkan role.
     *
     * - Mahasiswa: mengembalikan data lengkap termasuk prodi, peminatan, dosen PA, pembimbing
     * - Dosen: mengembalikan data dosen beserta prodi
     * - Lainnya (admin/kaprodi/sekprodi): data user dasar + prodi
     *
     * @param  User  $user
     * @return array
     */
    private function getUserDataByRole($user)
    {
        $user->load('prodi');

        // Data mahasiswa
        if ($user->hasRole('mahasiswa')) {
            $mahasiswa = $user->mahasiswa()->with(['prodi', 'peminatan'])->first();
            if ($mahasiswa) {
                return [
                    'id'          => $mahasiswa->id,
                    'user_id'     => $user->id,
                    'nim'         => $mahasiswa->nim,
                    'nama'        => $mahasiswa->nama,
                    'email'       => $user->email,
                    'no_hp'       => $mahasiswa->no_hp,
                    'alamat'      => $mahasiswa->alamat,
                    'semester'    => $mahasiswa->semester,
                    'ipk'         => $mahasiswa->ipk,
                    'prodi'       => $mahasiswa->prodi,
                    'peminatan'   => $mahasiswa->peminatan,
                    'dosen_pa'    => $mahasiswa->dosenPembimbingAkademik ? [
                        'id'   => $mahasiswa->dosenPembimbingAkademik->id,
                        'nama' => $mahasiswa->dosenPembimbingAkademik->nama,
                    ] : null,
                    'pembimbing1' => $mahasiswa->pembimbing1 ? [
                        'id'   => $mahasiswa->pembimbing1->id,
                        'nama' => $mahasiswa->pembimbing1->nama,
                    ] : null,
                    'pembimbing2' => $mahasiswa->pembimbing2 ? [
                        'id'   => $mahasiswa->pembimbing2->id,
                        'nama' => $mahasiswa->pembimbing2->nama,
                    ] : null,
                    'status'   => $mahasiswa->status,
                    'angkatan' => $mahasiswa->angkatan,
                ];
            }
        }

        // Data dosen
        if ($user->hasRole('dosen')) {
            $dosen = $user->dosen()->with('prodi')->first();
            if ($dosen) {
                return [
                    'id'      => $dosen->id,
                    'user_id' => $user->id,
                    'nidn'    => $dosen->nidn,
                    'nip'     => $dosen->nip,
                    'nama'    => $dosen->nama,
                    'email'   => $user->email,
                    'no_hp'   => $dosen->noHp,
                    'alamat'  => $dosen->alamat,
                    'prodi'   => $dosen->prodi,
                ];
            }
        }

        // Data role lain (admin, kaprodi, sekprodi, admin prodi)
        return [
            'id'      => $user->id,
            'nip_nim' => $user->nip_nim,
            'nama'    => $user->nama,
            'email'   => $user->email,
            'prodi'   => $user->prodi,
        ];
    }

    /**
     * Logout pengguna — menghapus token akses saat ini.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil logout']);
    }
}
