<?php

namespace App\Http\Middleware;

use App\Models\admin;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!($request->user() instanceof admin)) {
            return response()->json([
                'message' => 'Akses hanya untuk Admin'
            ], 403);
        }

        return $next($request);
    }
}
