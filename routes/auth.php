<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerificationController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('reset-password', [AuthenticatedSessionController::class, 'resetPassword'])
        ->name('password.reset');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

  
    Route::get('verify-account', [VerificationController::class, 'notice'])
        ->name('verification.notice');

    Route::post('verification.send', [VerificationController::class, 'send'])
    ->name('verification.send');

    Route::post('verification.verify', [VerificationController::class, 'verify'])
    ->name('verification.verify');
});
