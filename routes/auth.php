<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerificationController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::get('rocheli/login', [AuthenticatedSessionController::class, 'login'])
        ->name('admin.login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::post('rocheli/login', [AuthenticatedSessionController::class, 'adminStore']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::get('register/complete', [RegisteredUserController::class, 'complete'])
    ->middleware('auth')
    ->name('register.complete');

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::get('verify-account', [VerificationController::class, 'notice'])
        ->name('verification.notice');

    // Route::post('verification.send', [VerificationController::class, 'send'])
    //     ->name('verification.send');

    // Route::post('verification.verify', [VerificationController::class, 'verify'])
    //     ->name('verification.verify');

    Route::get('verify-email/{id}/{hash}', [VerificationController::class, 'verifyEmail'])
        ->middleware(['signed'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [VerificationController::class, 'resendEmail'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');
});