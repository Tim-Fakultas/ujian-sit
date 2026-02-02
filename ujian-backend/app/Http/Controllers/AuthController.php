<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
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

            // Get user data based on their role
            $userData = $this->getUserDataByRole($user);

            $isDefaultPassword = \Illuminate\Support\Facades\Hash::check($request->nip_nim, $user->password);

            return response()->json([
                'message' => 'Login berhasil',
                'success' => true,
                'role' => $user->getRoleNames()->first(), // Get the first role
                'roles' => $user->getRoleNames(), // All roles
                'permissions' => $user->getAllPermissions()->pluck('name'),
                'user' => $userData,
                'is_default_password' => $isDefaultPassword,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        }

        return response()->json(['message' => 'Invalid login details'], 401);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Password saat ini tidak sesuai',
            ], 422);
        }

        $user->password = \Illuminate\Support\Facades\Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diubah',
        ]);
    }

    private function getUserDataByRole($user)
    {
        // Load the user with prodi relationship
        $user->load('prodi');

        // Check if user is mahasiswa
        if ($user->hasRole('mahasiswa')) {
            $mahasiswa = $user->mahasiswa()->with(['prodi', 'peminatan'])->first();
            if ($mahasiswa) {
                return [
                    'id' => $mahasiswa->id,
                    'user_id' => $user->id,
                    'nim' => $mahasiswa->nim,
                    'nama' => $mahasiswa->nama,
                    'email' => $user->email,
                    'no_hp' => $mahasiswa->no_hp,
                    'alamat' => $mahasiswa->alamat,
                    'semester' => $mahasiswa->semester,
                    'ipk' => $mahasiswa->ipk,
                    'prodi' => $mahasiswa->prodi,
                    'peminatan' => $mahasiswa->peminatan,
                    'dosen_pa' => $mahasiswa->dosenPembimbingAkademik ? [
                        'id' => $mahasiswa->dosenPembimbingAkademik->id,
                        'nama' => $mahasiswa->dosenPembimbingAkademik->nama,
                    ] : null,
                    'pembimbing1' => $mahasiswa->pembimbing1 ? [
                        'id' => $mahasiswa->pembimbing1->id,
                        'nama' => $mahasiswa->pembimbing1->nama,
                    ] : null,
                    'pembimbing2' => $mahasiswa->pembimbing2 ? [
                        'id' => $mahasiswa->pembimbing2->id,
                        'nama' => $mahasiswa->pembimbing2->nama,
                    ] : null,
                    'status' => $mahasiswa->status,
                    'angkatan' => $mahasiswa->angkatan,
                ];
            }
        }

        // Check if user is dosen
        if ($user->hasRole('dosen')) {
            $dosen = $user->dosen()->with('prodi')->first();

            if ($dosen) {
                return [
                    'id' => $dosen->id,               // dosen_id
                    'user_id' => $user->id,           // user_id
                    'nidn' => $dosen->nidn,
                    'nip' => $dosen->nip,
                    'nama' => $dosen->nama,
                    'email' => $user->email,
                    'no_hp' => $dosen->noHp,
                    'alamat' => $dosen->alamat,
                    'prodi' => $dosen->prodi,
                ];
            }
        }


        // For other roles (admin, kaprodi, sekprodi, admin prodi)
        return [
            'id' => $user->id,
            'nip_nim' => $user->nip_nim,
            'nama' => $user->nama,
            'email' => $user->email,
            'prodi' => $user->prodi,
        ];
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }
}
