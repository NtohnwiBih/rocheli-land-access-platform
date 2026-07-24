<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state', 'lang']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'verified.any' => \App\Http\Middleware\EnsureAnyChannelVerified::class,
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->shouldRenderJsonWhen(
        fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
    );

    $exceptions->render(function (\Throwable $e, $request) {
        if ($request->expectsJson()) {
            return null; // let default JSON handling take over
        }

        $status = match (true) {
            $e instanceof \Illuminate\Auth\Access\AuthorizationException => 403,
            $e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface => $e->getStatusCode(),
                default => null,
            };

            if ($status === 403) {
                return \Inertia\Inertia::render('errors/forbidden')
                    ->toResponse($request)
                    ->setStatusCode(403);
            }

            if ($status === 404) {
                return \Inertia\Inertia::render('errors/not-found')
                    ->toResponse($request)
                    ->setStatusCode(404);
            }
        });
    })->create();
