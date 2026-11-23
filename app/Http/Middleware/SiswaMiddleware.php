<?php

namespace App\Http\Middleware;

use App\Models\siswa;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SiswaMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!($request->user() instanceof siswa)) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin'
            ], 403);
        }

        return $next($request);
    }
}
