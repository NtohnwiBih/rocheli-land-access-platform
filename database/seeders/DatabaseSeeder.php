<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            PlanSeeder::class,
            CitySeeder::class,
            PlanSeeder::class,
            CitySeeder::class,
            CategorySeeder::class,
            GlobalContentSeeder::class,
            SiteContentSeeder::class,
            AboutContentSeeder::class,
            ServicesContentSeeder::class,
            LandClubContentSeeder::class,
            ResourcesContentSeeder::class,
            ContactContentSeeder::class,
            TestimonialSeeder::class,
            FaqSeeder::class,
            ArticleSeeder::class,
        ]);
    }
}
