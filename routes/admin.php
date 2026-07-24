<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\AppointmentActionController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\ContactCenterController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\ContributionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EnquiryController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\LegalDocumentController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\TeamController;

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

        Route::resource('testimonials', TestimonialController::class)
            ->except(['show']);

        Route::resource('faqs', FaqController::class)
            ->except(['show']);

        Route::resource('articles', ArticleController::class)
            ->except(['show']);

        Route::resource('categories', CategoryController::class)
            ->except(['show']);

        Route::resource('properties', PropertyController::class)
            ->except(['show']);

        Route::post('properties/{property}/media', [PropertyController::class, 'storeMedia'])
            ->name('properties.media.store');

        Route::delete('properties/{property}/media/{media}', [PropertyController::class, 'destroyMedia'])
            ->name('properties.media.destroy');

        Route::get('members', [MemberController::class, 'index'])
            ->name('members.index');

        Route::get('members/{member}', [MemberController::class, 'show'])
            ->name('members.show');

        Route::get('members/{member}/document', [MemberController::class, 'document'])
            ->name('members.document');

        Route::get('members/{member}/document-back', [MemberController::class, 'documentBack'])
            ->name('members.document-back');

        Route::post('contributions/{contribution}/approve', [ContributionController::class, 'approve'])
            ->name('contributions.approve');

        Route::post('contributions/{contribution}/reject', [ContributionController::class, 'reject'])
            ->name('contributions.reject');

        Route::get('contributions/{contribution}/proof', [ContributionController::class, 'proof'])
            ->name('contributions.proof');

        Route::post('notifications/{id}/read', function (Request $request, string $id) {
            $request->user()->notifications()->where('id', $id)->first()?->markAsRead();
            return back();
        })->name('notifications.read');

        Route::get('legal', [LegalDocumentController::class, 'index'])
            ->name('legal.index');

        Route::put('legal/{key}', [LegalDocumentController::class, 'update'])
            ->name('legal.update');

        Route::resource('plans', PlanController::class)
            ->except(['show', 'create', 'edit']);

        Route::get('enquiries', [EnquiryController::class, 'index'])
            ->name('enquiries.index');

        Route::get('enquiries/{enquiry}', [EnquiryController::class, 'show'])
            ->name('enquiries.show');

        Route::post('enquiries/{enquiry}/respond', [EnquiryController::class, 'respond'])
            ->name('enquiries.respond');

        Route::get('contacts', [ContactCenterController::class, 'index'])->name('contacts.index');

        Route::post('contacts/{contact}/handled', [ContactMessageController::class, 'markHandled'])
            ->name('contacts.handled');
        Route::delete('contacts/{contact}', [ContactMessageController::class, 'destroy'])
            ->name('contacts.destroy');

        Route::post('appointments/{appointment}/confirm', [AppointmentActionController::class, 'confirm'])->name('appointments.confirm');
        Route::post('appointments/{appointment}/cancel', [AppointmentActionController::class, 'cancel'])->name('appointments.cancel');

        Route::get('enquiries/{enquiry}', [EnquiryController::class, 'show'])->name('enquiries.show');
        Route::post('enquiries/{enquiry}/respond', [EnquiryController::class, 'respond'])->name('enquiries.respond');

        Route::resource('team-members', TeamController::class)
            ->except(['show'])
            ->parameters(['team-members' => 'team']);
    });