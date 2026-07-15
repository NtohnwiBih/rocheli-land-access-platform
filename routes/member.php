<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Member\DashboardController;

Route::prefix('member')
    ->name('member.')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/', [DashboardController::class, 'create'])
        ->name('dashboard');
});