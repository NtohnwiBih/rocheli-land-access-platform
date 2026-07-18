<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourcesController extends Controller
{
    protected array $sections = ['hero', 'featured', 'articles'];

    public function __construct(
        protected SiteContentRepositoryInterface $siteContent,
    ) {}

    public function index(Request $request): Response
    {
        $locale = $request->cookie('lang', 'en');

        return Inertia::render('site/resources', [
            'content' => $this->siteContent->forFrontend('resources', $this->sections, $locale),
            'articles' => $this->siteContent->articlesForFrontend($locale, 12),
        ]);
    }
}