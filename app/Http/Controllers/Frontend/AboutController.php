<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    protected array $sections = ['hero', 'story', 'mission', 'leadership'];

    public function __construct(
        protected SiteContentRepositoryInterface $siteContent,
    ) {}

    public function index(Request $request): Response
    {
        $locale = $request->cookie('lang', 'en');

        return Inertia::render('site/about', [
            'content' => $this->siteContent->forFrontend('about', $this->sections, $locale),
            'teams' => Team::orderBy('order')
                ->get()
                ->map(fn (Team $m) => [
                    'id' => $m->id,
                    'name' => $m->nameForLocale($locale),
                    'role' => $m->positionForLocale($locale),
                    'image' => $m->image_url,
                ]),
        ]);
    }
}