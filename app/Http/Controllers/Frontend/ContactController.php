<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
}