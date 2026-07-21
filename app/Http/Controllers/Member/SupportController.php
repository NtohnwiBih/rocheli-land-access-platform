<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\StoreSupportRequest;
use App\Mail\SupportRequestMail;
use App\Mail\SupportRequestReceivedMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class SupportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('member/support');
    }

    public function store(StoreSupportRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        Mail::to(config('mail.support_address', 'support@rocheli.com'))
            ->send(new SupportRequestMail(
                user: $user,
                category: $validated['category'],
                subject: $validated['subject'],
                message: $validated['message'],
            ));

        if ($user->email) {
            Mail::to($user->email)->send(
                new SupportRequestReceivedMail($user->name, $validated['subject'])
            );
        }

        return back()->with('success', 'Your message has been sent — we\'ll be in touch shortly.');
    }
}