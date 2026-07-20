<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArticleRequest;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/articles/index', [
            'articles' => Article::latest('published_at')->get()->map(fn (Article $a) => [
                'id' => $a->id,
                'slug' => $a->slug,
                'title_en' => $a->title['en'] ?? '',
                'category_en' => $a->category['en'] ?? '',
                'author' => $a->author,
                'image' => $a->image_url,
                'published_at' => $a->published_at?->format('M j, Y'),
                'is_published' => $a->is_published,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/articles/form', [
            'article' => null,
            'categories' => Category::forArticles()->active()->get()->map(fn (Category $c) => [
                'id' => $c->id,
                'name_en' => $c->name['en'] ?? '',
            ]),
        ]);
    }

    public function store(StoreArticleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('articles', 'public')
            : null;

        $slug = ! empty($validated['slug']) ? $validated['slug'] : Article::generateUniqueSlug($validated['title_en']);

        Article::create($this->mapPayload($validated, $imagePath, $slug));

        return redirect()->route('admin.articles.index')->with('success', 'Article created.');
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('admin/articles/form', [
            'article' => [
                'id' => $article->id,
                'slug' => $article->slug,
                'title_en' => $article->title['en'] ?? '',
                'title_fr' => $article->title['fr'] ?? '',
                'excerpt_en' => $article->excerpt['en'] ?? '',
                'excerpt_fr' => $article->excerpt['fr'] ?? '',
                'body_en' => $article->body['en'] ?? '',
                'body_fr' => $article->body['fr'] ?? '',
                'category_id' => $article->category_id,
                'author' => $article->author,
                'read_time' => $article->read_time,
                'image' => $article->image_url,
                'published_at' => $article->published_at?->format('Y-m-d'),
                'is_published' => $article->is_published,
            ],
            'categories' => Category::forArticles()->active()->get()->map(fn (Category $c) => [
                'id' => $c->id,
                'name_en' => $c->name['en'] ?? '',
            ]),
        ]);
    }

    public function update(StoreArticleRequest $request, Article $article): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $article->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('articles', 'public');
        }

        $slug = ! empty($validated['slug']) ? $validated['slug'] : $article->slug;

        $article->update($this->mapPayload($validated, $imagePath, $slug));

        return redirect()->route('admin.articles.index')->with('success', 'Article updated.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        if ($article->image_path) {
            Storage::disk('public')->delete($article->image_path);
        }

        $article->delete();

        return back()->with('success', 'Article removed.');
    }

    protected function mapPayload(array $validated, ?string $imagePath, string $slug): array
    {
        return [
            'slug' => $slug,
            'title' => ['en' => $validated['title_en'], 'fr' => $validated['title_fr']],
            'excerpt' => ['en' => $validated['excerpt_en'] ?? '', 'fr' => $validated['excerpt_fr'] ?? ''],
            'body' => ['en' => $validated['body_en'] ?? '', 'fr' => $validated['body_fr'] ?? ''],
            'category_id' => $validated['category_id'],
            'author' => $validated['author'] ?? null,
            'read_time' => $validated['read_time'] ?? null,
            'image_path' => $imagePath,
            'published_at' => $validated['published_at'] ?? now(),
            'is_published' => $validated['is_published'] ?? true,
        ];
    }
}