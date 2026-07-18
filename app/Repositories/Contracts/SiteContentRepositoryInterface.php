<?php

namespace App\Repositories\Contracts;

use Illuminate\Http\UploadedFile;

interface SiteContentRepositoryInterface
{
    public function allSections(string $page, array $keys): array;

    public function updateSection(string $page, string $key, array $en, array $fr): void;

    public function storeImage(UploadedFile $file, string $directory = 'site-content'): string;

    public function deleteImage(?string $publicUrl): void;

    public function forFrontend(string $page, array $keys, string $locale): array;

    public function testimonialsForFrontend(string $locale, int $limit = 6): array;

    public function faqsForFrontend(string $locale): array;

    public function articlesForFrontend(string $locale, int $limit = 3): array;
}