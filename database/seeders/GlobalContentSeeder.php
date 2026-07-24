<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class GlobalContentSeeder extends Seeder
{
    public function run(): void
    {
        $page = 'global';

        $sections = [
            'footer' => [
                'en' => [
                    'description' => 'A trusted real-estate savings platform helping members across Cameroon build wealth through verified land and property ownership.',
                    'phone' => '+237 6XX XXX XXX',
                    'email' => 'hello@rocheli.com',
                    'address' => 'Ellig-Effa, Yaounde, Cameroon',
                    'facebookUrl' => '',
                    'instagramUrl' => '',
                    'linkedinUrl' => '',
                    'twitterUrl' => '',
                ],
                'fr' => [
                    'description' => 'Une plateforme d\'épargne immobilière de confiance aidant les membres à travers le Cameroun à bâtir la richesse grâce à la propriété foncière vérifiée.',
                    'phone' => '+237 6XX XXX XXX',
                    'email' => 'hello@rocheli.com',
                    'address' => 'Elig-Effa, Yaoundé, Cameroun',
                    'facebookUrl' => '',
                    'instagramUrl' => '',
                    'linkedinUrl' => '',
                    'twitterUrl' => '',
                ],
            ],
        ];

        foreach ($sections as $key => $content) {
            SiteContent::updateOrCreate(['page' => $page, 'key' => $key], ['content' => $content]);
        }
    }
}