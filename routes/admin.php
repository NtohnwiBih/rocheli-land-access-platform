<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ContentController;

Route::prefix('rocheli')
    ->name('admin.')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/', [DashboardController::class, 'create'])
            ->name('dashboard');

        Route::get('content/{page}', [ContentController::class, 'edit'])
            ->name('content.edit');

        Route::put('content/{page}', [ContentController::class, 'update'])
            ->name('content.update');

        Route::post('content/upload-image', [ContentController::class, 'uploadImage'])
            ->name('content.upload-image');
    });