<?php

use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Article::whereNull('category_id')->get()->each(function (Article $article) {
            $categoryNameEn = $article->getRawOriginal('category');
            $decoded = json_decode($categoryNameEn, true);
            $nameEn = $decoded['en'] ?? null;

            if (! $nameEn) {
                return;
            }

            $category = Category::forArticles()
                ->whereJsonContains('name->en', $nameEn)
                ->first();

            if ($category) {
                $article->update(['category_id' => $category->id]);
            }
        });
    }

    public function down(): void
    {
       
    }
};