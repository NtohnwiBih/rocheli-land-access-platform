<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendVerificationCodeRequest;
use App\Http\Requests\Auth\VerifyCodeRequest;
use App\Services\VerificationCodeService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class VerificationController extends Controller
{
    public function __construct(
        protected VerificationCodeService $codes,
    ) {}

    public function notice(): Response
    {
        $user = Auth::user();

        return Inertia::render('auth/verify-account', [
            'email' => $user->email,
            'phone' => $user->phone,
            'resendAvailableInSeconds' => 45,
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
}