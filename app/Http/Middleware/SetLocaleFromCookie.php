<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocaleFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->cookie('lang', config('app.locale'));

        if (in_array($locale, ['en', 'fr'], true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}