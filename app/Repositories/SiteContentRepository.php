<?php

namespace App\Repositories;

use App\Models\SiteContent;
use App\Models\Article;
use App\Models\Faq;
use App\Models\Testimonial;
use App\Repositories\Contracts\SiteContentRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SiteContentRepository implements SiteContentRepositoryInterface
{
    public function allSections(string $page, array $keys): array
    {
        $rows = SiteContent::forPage($page)->whereIn('key', $keys)->get()->keyBy('key');

        return collect($keys)->mapWithKeys(function (string $key) use ($rows) {
            $row = $rows->get($key);
            return [$key => $row?->content ?? ['en' => [], 'fr' => []]];
        })->all();
    }

    public function updateSection(string $page, string $key, array $en, array $fr): void
    {
        SiteContent::updateOrCreate(
            ['page' => $page, 'key' => $key],
            ['content' => ['en' => $en, 'fr' => $fr]]
        );
    }

    public function forFrontend(string $page, array $keys, string $locale): array
    {
        $rows = SiteContent::forPage($page)->whereIn('key', $keys)->get()->keyBy('key');

        return collect($keys)->mapWithKeys(function (string $key) use ($rows, $locale) {
            $content = $rows->get($key)?->content ?? [];
            return [$key => $content[$locale] ?? $content['en'] ?? []];
        })->all();
    }

    public function storeImage(UploadedFile $file, string $directory = 'site-content'): string
    {
        $filename = Str::uuid() . '.' . $file->extension();
        $path = $file->storeAs($directory, $filename, 'public');
        return Storage::disk('public')->url($path);
    }

    public function deleteImage(?string $publicUrl): void
    {
        if (! $publicUrl) return;
        $relative = ltrim(str_replace('/storage/', '', parse_url($publicUrl, PHP_URL_PATH) ?? ''), '/');
        if ($relative && Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }
    }

    public function testimonialsForFrontend(string $locale, int $limit = 6): array
    {
        return Testimonial::published()->take($limit)->get()->map(fn ($t) => $t->forLocale($locale))->all();
    }

    public function faqsForFrontend(string $locale): array
    {
        return Faq::published()->get()->map(fn ($f) => $f->forLocale($locale))->all();
    }

    public function articlesForFrontend(string $locale, int $limit = 3): array
    {
        return Article::published()->take($limit)->get()->map(fn ($a) => $a->forLocale($locale))->all();
    }
}