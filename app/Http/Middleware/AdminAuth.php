<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (session('user') == null || !session('user') instanceof User || session('user')->type != "ADMIN") {
            if ($request->method() == "POST") {
                return abort(403);
            } else {
                return redirect('/admin/login');
            }
        }

        return $next($request);
    }
}
