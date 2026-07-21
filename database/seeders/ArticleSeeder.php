<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $investing = Category::forArticles()->where('slug', 'investing')->first();
        $legal = Category::forArticles()->where('slug', 'legal')->first();
        $insights = Category::forArticles()->where('slug', 'insights')->first();

        $articles = [
            [
                'slug' => 'why-land-remains-cameroons-most-resilient-asset',
                'title' => ['en' => 'Why land remains Cameroon\'s most resilient asset', 'fr' => 'Pourquoi le terrain reste l\'actif le plus résilient du Cameroun'],
                'excerpt' => ['en' => 'A look at long-term land value trends across major corridors.', 'fr' => 'Un regard sur les tendances de valeur foncière à long terme.'],
                'category_id' => $investing?->id,
                'author' => 'Rocheli Desk',
                'read_time' => '5 min read',
                'published_at' => now()->subMonths(2),
            ],
            [
                'slug' => 'seven-checks-before-you-sign',
                'title' => ['en' => 'The 7 checks every buyer must run before signing', 'fr' => 'Les 7 vérifications avant de signer'],
                'excerpt' => ['en' => 'A practical due-diligence checklist for land buyers.', 'fr' => 'Une liste de vérification pratique pour les acheteurs.'],
                'category_id' => $legal?->id,
                'author' => 'Rocheli Desk',
                'read_time' => '7 min read',
                'published_at' => now()->subMonths(3),
            ],
            [
                'slug' => 'structured-savings-vs-traditional-plots',
                'title' => ['en' => 'Structured savings vs. traditional plots: what the numbers say', 'fr' => 'Épargne structurée vs terrains traditionnels'],
                'excerpt' => ['en' => 'Comparing ownership paths side by side.', 'fr' => 'Comparaison des parcours de propriété.'],
                'category_id' => $insights?->id,
                'author' => 'Rocheli Desk',
                'read_time' => '6 min read',
                'published_at' => now()->subMonth(),
            ],
        ];

        foreach ($articles as $a) {
            Article::updateOrCreate(['slug' => $a['slug']], $a + ['is_published' => true]);
        }
    }
}