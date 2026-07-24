<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Frontend\AboutController;
use App\Http\Controllers\Frontend\AppointmentController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\LandClubController;
use App\Http\Controllers\Frontend\ResourcesController;
use App\Http\Controllers\Frontend\ServicesController;
use App\Http\Controllers\Frontend\EnquiryFormController;
use App\Http\Controllers\Frontend\PropertyController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{property:slug}', [PropertyController::class, 'show'])->name('properties.show');
Route::get('/land-access-club', [LandClubController::class, 'index'])->name('land-club');
Route::get('/services', [ServicesController::class, 'index'])->name('services');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/resources', [ResourcesController::class, 'index'])->name('resources');
Route::get('/resources/{article:slug}', [ResourcesController::class, 'show'])->name('resources.show');
Route::get('/contact', [AppointmentController::class, 'index'])->name('contact');
Route::post('/appointment', [AppointmentController::class, 'store'])->name('appoinment.store');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/enquiries', [EnquiryFormController::class, 'store'])->name('enquiries.store');

Route::fallback(function () {
    return Inertia::render('errors/not-found');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
require __DIR__.'/member.php';