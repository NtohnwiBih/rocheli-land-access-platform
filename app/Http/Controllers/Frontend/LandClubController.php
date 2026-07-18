<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandClubController extends Controller
{
    protected array $sections = ['hero', 'benefits', 'journey', 'eligibility'];

    public function __construct(
        protected SiteContentRepositoryInterface $siteContent,
    ) {}

    public function index(Request $request): Response
    {
        $locale = $request->cookie('lang', 'en');

        return Inertia::render('site/land-club', [
            'content' => $this->siteContent->forFrontend('land-club', $this->sections, $locale),
            'testimonials' => $this->siteContent->testimonialsForFrontend($locale),
            'faqs' => $this->siteContent->faqsForFrontend($locale),
        ]);
    }
}