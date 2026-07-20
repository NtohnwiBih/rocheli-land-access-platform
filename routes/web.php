<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\AboutController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\LandClubController;
use App\Http\Controllers\Frontend\ResourcesController;
use App\Http\Controllers\Frontend\ServicesController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::inertia('/properties', 'site/properties')->name('properties');
Route::get('/land-access-club', [LandClubController::class, 'index'])->name('land-club');
Route::get('/services', [ServicesController::class, 'index'])->name('services');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/resources', [ResourcesController::class, 'index'])->name('resources');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
require __DIR__.'/member.php';