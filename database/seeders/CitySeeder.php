<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            ['key' => 'yaounde', 'name_en' => 'Yaoundé', 'name_fr' => 'Yaoundé', 'sort_order' => 1],
            ['key' => 'douala', 'name_en' => 'Douala', 'name_fr' => 'Douala', 'sort_order' => 2],
            ['key' => 'buea', 'name_en' => 'Buea', 'name_fr' => 'Buea', 'sort_order' => 3],
            ['key' => 'limbe', 'name_en' => 'Limbe', 'name_fr' => 'Limbé', 'sort_order' => 4],
            ['key' => 'bamenda', 'name_en' => 'Bamenda', 'name_fr' => 'Bamenda', 'sort_order' => 5],
            ['key' => 'bafoussam', 'name_en' => 'Bafoussam', 'name_fr' => 'Bafoussam', 'sort_order' => 6],
            ['key' => 'kribi', 'name_en' => 'Kribi', 'name_fr' => 'Kribi', 'sort_order' => 7],
        ];

        foreach ($cities as $city) {
            City::updateOrCreate(['key' => $city['key']], $city);
        }
    }
}