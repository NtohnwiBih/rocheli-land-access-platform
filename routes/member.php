<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Member\CalculatorController;
use App\Http\Controllers\Member\ContributionController;
use App\Http\Controllers\Member\DashboardController;
use App\Http\Controllers\Member\LegalDocumentController;
use App\Http\Controllers\Member\MemberPlanController;
use App\Http\Controllers\Member\NotificationController;
use App\Http\Controllers\Member\ProfileController;
use App\Http\Controllers\Member\PropertyController;
use App\Http\Controllers\Member\SupportController;

Route::prefix('member')
    ->name('member.')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/', [DashboardController::class, 'create'])
            ->name('dashboard');

        Route::get('/contributions', [ContributionController::class, 'index'])
            ->name('contributions');

        Route::post('/contributions', [ContributionController::class, 'store'])
            ->name('contributions.store');

        Route::get('/contributions/{contribution}/proof', [ContributionController::class, 'proof'])
            ->name('contributions.proof');

        Route::get('/property', [PropertyController::class, 'index'])
            ->name('property');

        Route::post('/property/enquiries', [PropertyController::class, 'storeEnquiry'])
            ->name('property.enquiries.store');

        Route::get('/calculator', [CalculatorController::class, 'index'])
            ->name('calculator');

        Route::get('/plans', [MemberPlanController::class, 'index'])
            ->name('plans');

        Route::post('/plans', [MemberPlanController::class, 'store'])
            ->name('plans.store');

        Route::get('/notifications', [NotificationController::class, 'index'])
            ->name('notifications');

        Route::get('/notifications/{id}', [NotificationController::class, 'show'])
            ->name('notifications.show');
       
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead'])
            ->name('notifications.read');
       
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])
            ->name('notifications.read-all');

        Route::post('/plans/{memberPlan}/suspend', [MemberPlanController::class, 'suspend'])
            ->name('plans.suspend');
        
        Route::get('/legal', [LegalDocumentController::class, 'index'])
            ->name('legal');

        Route::get('/profile', [ProfileController::class, 'index'])
            ->name('profile');

        Route::patch('/profile', [ProfileController::class, 'update'])
            ->name('profile.update');

        Route::get('/support', [SupportController::class, 'index'])
            ->name('support');

        Route::post('/support', [SupportController::class, 'store'])
            ->name('support.store');

        return Inertia::render('/referrals');
    });