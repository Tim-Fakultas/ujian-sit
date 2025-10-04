<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Hash;
use Illuminate\Http\Request;



class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'nip_nim'=> 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = [
            'nip_nim' => $request->nip_nim,
            'password' => $request->password,
        ];


        if(Auth::attempt($credentials)){
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login berhasil',
                'success' => true,
                'role' => $user->getRoleNames(),
                'permissons' => $user->getAllPermissions(),
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        }

        return response()->json(['message' => 'Invalid login details'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }
}
