<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendVerificationCodeRequest;
use App\Http\Requests\Auth\VerifyCodeRequest;
use App\Mail\NewMemberApplication;
use App\Mail\WelcomeMember;
use App\Services\VerificationCodeService;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class VerificationController extends Controller
{
    public function __construct(
        protected VerificationCodeService $codes,
    ) {}

    public function notice(): Response
    {
        return Inertia::render('auth/verify-email', [
            'status' => session('status'),
        ]);
    }

    public function send(SendVerificationCodeRequest $request)
    {
        $user = Auth::user();

        if ($request->method === 'email' && ! $user->email) {
            return back()->withErrors(['method' => 'Add an email to your profile first.']);
        }

        if ($request->method === 'phone' && $user->phone_verified_at) {
            return back()->with('status', 'already-verified');
        }

        if ($request->method === 'email' && $user->email_verified_at) {
            return back()->with('status', 'already-verified');
        }

        $this->codes->issue($user, $request->method);

        return back()->with('status', 'verification-code-sent');
    }

    public function verify(VerifyCodeRequest $request)
    {
        $user = Auth::user();

        if (! $this->codes->verify($user, $request->method, $request->code)) {
            return back()->withErrors(['code' => 'That code is invalid or has expired.']);
        }

        // Phone verified is enough to proceed into the app. Email (if present)
        // can still be verified later from the profile without blocking access.
        if ($request->method === 'phone') {
            return redirect()->route('dashboard')->with('status', 'phone-verified');
        }

        return back()->with('status', 'email-verified');
    }

    public function verifyEmail(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('member.dashboard');
        }

        $request->fulfill();

        $user = $request->user();

        // Welcome email fires here — the first point we know the address is
        // real and belongs to the user — rather than at registration time.
        try {
            Mail::to($user->email)->send(new WelcomeMember($user));
        } catch (\Throwable $e) {
            Log::error('Failed to send welcome email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        $member = $user->member;

        if ($member) {
            try {
                Mail::to(config('mail.company_notification_email'))
                    ->send(new NewMemberApplication($member->fresh(['user'])));
            } catch (\Throwable $e) {
                Log::error('Failed to send new member application notification', [
                    'member_id' => $member->id,
                    'error' => $e->getMessage(),
                ]);
            }
        } else {
            Log::warning('Email verified but no associated member found — notification not sent.', [
                'user_id' => $user->id,
            ]);
        }

        return redirect()->route('member.dashboard')->with('success', 'Email verified.');
    }

    public function resendEmail(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('member.dashboard');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('success', 'Verification link sent.');
    }
}