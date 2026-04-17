<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CheckRole — Middleware untuk memeriksa role pengguna.
 *
 * Penggunaan di route: `->middleware('role:admin')` atau `->middleware('role:kaprodi')`
 * Menggunakan Spatie Permission `hasRole()` untuk validasi.
 */
class CheckRole
{
    /**
     * Periksa apakah user yang login memiliki role yang diperlukan.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @param  string   $role  Nama role yang diizinkan
     * @return Response
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()?->hasRole($role)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
