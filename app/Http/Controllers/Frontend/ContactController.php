<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use App\Models\ContactMessage;
use App\Models\User;
use App\Notifications\NewContactSubmitted;
use App\Http\Requests\StoreContactMessageRequest;
use App\Notifications\NewContactMessage;

class ContactController extends Controller
{
    protected array $sections = ['hero', 'form', 'booking', 'whatsapp', 'offices'];

    public function __construct(
        protected SiteContentRepositoryInterface $siteContent,
    ) {}

    public function index(Request $request): Response
    {
        $locale = $request->cookie('lang', 'en');

        return Inertia::render('site/contact', [
            'content' => $this->siteContent->forFrontend('contact', $this->sections, $locale),
        ]);
    }

    // public function store(StoreContactRequest $request): RedirectResponse
    // {
    //     $contact = Contact::create($request->validated() + ['status' => 'new']);

    //     User::where('role', 'admin')->get()->each(
    //         fn (User $admin) => $admin->notify(new NewContactSubmitted($contact))
    //     );

    //     return back()->with('success', 'Thanks for reaching out — we will get back to you within one business day.');
    // }

    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        $contactMessage = ContactMessage::create($request->validated());

        User::where('role', 'admin')->get()->each(
            fn (User $admin) => $admin->notify(new NewContactMessage($contactMessage))
        );

        return back()->with('success', 'Your message has been sent — we\'ll respond within one business day.');
    }
}