<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Plan;
use App\Models\Property;

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
            'properties' => Property::with(['category', 'city'])->latest()->get()->map(fn (Property $p) => [
                'id' => $p->id,
                'title' => $p->titleForLocale('en'),
                'location' => $p->location,
                'city' => $p->city?->name_en ?? '—',
                'category' => $p->category?->name['en'] ?? '—',
                'price' => $p->price,
                'status' => $p->status,
                'image' => $p->image_url,
            ]),
            'plans' => Plan::active()->get()->map(fn (Plan $p) => $p->toDisplayArray()),
            'content' => $this->siteContent->forFrontend('home', $this->sections, $locale),
            'testimonials' => $this->siteContent->testimonialsForFrontend($locale),
            'faqs' => $this->siteContent->faqsForFrontend($locale),
            'articles' => $this->siteContent->articlesForFrontend($locale),
        ]);
    }
}