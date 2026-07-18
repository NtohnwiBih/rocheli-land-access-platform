<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    protected array $sections = [
        'hero', 'whyRocheli', 'savingsProgram', 'steps', 'testimonials', 'faq', 'articles', 'cta', 'footer',
    ];

    public function __construct(
        protected SiteContentRepositoryInterface $siteContent,
    ) {}

    public function index(Request $request): Response
    {
        $locale = $request->cookie('lang', 'en');

        return Inertia::render('site/index', [
            'content' => $this->siteContent->forFrontend('home', $this->sections, $locale),
            'testimonials' => $this->siteContent->testimonialsForFrontend($locale),
            'faqs' => $this->siteContent->faqsForFrontend($locale),
            'articles' => $this->siteContent->articlesForFrontend($locale),
        ]);
    }
}