<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use App\Models\User;
use App\Notifications\ContactAcknowledged;
use App\Notifications\NewContactReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Notification;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): RedirectResponse
    {
        $contact = Contact::create($request->validated());

        $admins = User::where('role', 'admin')->get();
        if ($admins->isNotEmpty()) {
            Notification::send($admins, new NewContactReceived($contact));
        }

        if ($contact->email) {
            Notification::route('mail', $contact->email)
                ->notify(new ContactAcknowledged($contact));
        }

        return back()->with('success', 'Thanks — we will be in touch within one business day.');
    }
}