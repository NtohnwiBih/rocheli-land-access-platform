<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    protected array $pages = [
        'home' => ['hero', 'whyRocheli', 'savingsProgram', 'steps', 'testimonials', 'faq', 'articles', 'cta', 'footer'],
        'about' => ['story', 'mission'],
        'services' => ['intro'],
        'land-club' => ['hero'],
        'contact' => ['intro'],
    ];

    public function __construct(protected SiteContentRepositoryInterface $siteContent) {}

    public function edit(string $page): Response
    {
        abort_unless(isset($this->pages[$page]), 404);

        return Inertia::render("admin/content/{$page}", [
            'content' => $this->siteContent->allSections($page, $this->pages[$page]),
        ]);
    }

    public function update(Request $request, string $page): RedirectResponse
    {
        abort_unless(isset($this->pages[$page]), 404);

        $validated = $request->validate([
            'section' => ['required', 'string', Rule::in($this->pages[$page])],
            'en' => ['required', 'array'],
            'fr' => ['required', 'array'],
        ]);

        $this->siteContent->updateSection($page, $validated['section'], $validated['en'], $validated['fr']);

        return back();
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'],
            'previous_url' => ['nullable', 'string'],
        ]);

        $url = $this->siteContent->storeImage($request->file('image'));

        if ($request->filled('previous_url')) {
            $this->siteContent->deleteImage($request->string('previous_url')->toString());
        }

        return response()->json(['url' => $url]);
    }
}