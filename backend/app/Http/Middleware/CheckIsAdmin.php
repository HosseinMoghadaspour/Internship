<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // ابتدا بررسی کنید که کاربر احراز هویت شده است یا خیر
        if (!Auth::check() || !Auth::user()->is_admin) {
            return response()->json([
                'message' => 'شما دسترسی لازم برای انجام این عملیات را ندارید.'
            ], 403);
        }

        return $next($request);
    }
}