<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // تعریف یک نام مستعار برای میدل‌ور ادمین
        $middleware->alias([
            'admin' => \App\Http\Middleware\CheckIsAdmin::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // میدل‌ور ادمین را از اینجا حذف کنید
        // $middleware->api(prepend: [
        //     \App\Http\Middleware\CheckIsAdmin::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
