<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Article;
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

        return Inertia::render('site/resources/index', [
            'content' => $this->siteContent->forFrontend('resources', $this->sections, $locale),
            'articles' => $this->siteContent->articlesForFrontend($locale, 12),
        ]);
    }

    public function show(Request $request, Article $article): Response
    {
        $locale = $request->cookie('lang', 'en');

        abort_unless($article->is_published, 404);

        $related = Article::published()
            ->where('id', '!=', $article->id)
            ->when($article->category_id, fn ($q) => $q->where('category_id', $article->category_id))
            ->limit(3)
            ->get()
            ->map(fn (Article $a) => $a->forLocale($locale));

        // Fall back to latest published articles if this one has no
        // category, or its category has no other members yet.
        if ($related->isEmpty()) {
            $related = Article::published()
                ->where('id', '!=', $article->id)
                ->limit(3)
                ->get()
                ->map(fn (Article $a) => $a->forLocale($locale));
        }

        return Inertia::render('site/resources/show', [
            'article' => $article->forDetail($locale),
            'related' => $related,
        ]);
    }
}