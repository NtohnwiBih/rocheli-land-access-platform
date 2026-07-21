<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $articleCategories = [
            ['en' => 'Investing', 'fr' => 'Investissement'],
            ['en' => 'Legal', 'fr' => 'Juridique'],
            ['en' => 'Insights', 'fr' => 'Analyses'],
        ];

        foreach ($articleCategories as $i => $name) {
            Category::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($name['en']), 'type' => 'article'],
                ['name' => $name, 'type' => 'article', 'sort_order' => $i + 1, 'is_active' => true]
            );
        }

        $propertyCategories = [
            ['en' => 'Residential', 'fr' => 'Résidentiel'],
            ['en' => 'Commercial', 'fr' => 'Commercial'],
            ['en' => 'Land', 'fr' => 'Terrain'],
            ['en' => 'Agricultural', 'fr' => 'Agricole'],
        ];

        foreach ($propertyCategories as $i => $name) {
            Category::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($name['en']), 'type' => 'property'],
                ['name' => $name, 'type' => 'property', 'sort_order' => $i + 1, 'is_active' => true]
            );
        }
    }
}