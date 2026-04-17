<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ProdiAccess — Middleware untuk membatasi akses berdasarkan prodi.
 *
 * Memastikan user hanya bisa mengakses data dari prodi yang sama.
 * User harus memiliki `prodi_id` yang cocok dengan `prodi_id` di request.
 */
class ProdiAccess
{
    /**
     * Validasi bahwa prodi user cocok dengan prodi di request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()->prodi_id !== $request->prodi_id) {
            abort(403, 'Akses ditolak. Anda tidak memiliki akses ke prodi ini.');
        }

        return $next($request);
    }
}
