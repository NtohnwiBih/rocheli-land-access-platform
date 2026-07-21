<?php

namespace App\Http\Controllers\Admin;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class ContactMessageController extends Controller
{
    public function markHandled(ContactMessage $contact): RedirectResponse
    {
        $contact->update(['handled' => true]);

        return back()->with('success', 'Marked as handled.');
    }

    public function destroy(ContactMessage $contact): RedirectResponse
    {
        $contact->delete();

        return back()->with('success', 'Message deleted.');
    }
}