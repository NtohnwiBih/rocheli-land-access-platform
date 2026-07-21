<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ContactResponded;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function markRead(Contact $contact): RedirectResponse
    {
        if ($contact->status === 'new') {
            $contact->update(['status' => 'read']);
        }

        return back();
    }

    public function respond(Request $request, Contact $contact): RedirectResponse
    {
        $request->validate(['response' => ['required', 'string', 'max:2000']]);

        $contact->update([
            'response' => $request->string('response'),
            'status' => 'responded',
            'responded_by' => $request->user()->id,
            'responded_at' => now(),
        ]);

        if ($contact->email) {
            Mail::to($contact->email)->send(new ContactResponded($contact));
        }

        return back()->with('success', 'Response sent.');
    }
}