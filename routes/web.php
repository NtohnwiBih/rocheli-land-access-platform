<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'site/index')->name('home');
Route::inertia('/properties', 'site/properties')->name('properties');
Route::inertia('/land-access-club', 'site/land-club')->name('land-club');
Route::inertia('/services', 'site/services')->name('services');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
