<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class ResourcesContentSeeder extends Seeder
{
    public function run(): void
    {
        $page = 'resources';

        $sections = [
            'hero' => [
                'en' => [
                    'eyebrow' => 'Knowledge hub',
                    'title' => 'Everything you need to',
                    'titleAccent' => 'buy, own, grow.',
                    'description' => 'Guides, videos, market reports and downloads written by Rocheli\'s real estate, legal and finance teams.',
                ],
                'fr' => [
                    'eyebrow' => 'Centre de ressources',
                    'title' => 'Tout ce qu\'il vous faut pour',
                    'titleAccent' => 'acheter, posséder, développer.',
                    'description' => 'Guides, vidéos, rapports de marché et téléchargements rédigés par les équipes immobilier, juridique et finance de Rocheli.',
                ],
            ],

            'featured' => [
                'en' => [
                    'eyebrow' => 'Featured',
                    'title' => 'Editor\'s picks this month',
                ],
                'fr' => [
                    'eyebrow' => 'À la une',
                    'title' => 'Les sélections du mois',
                ],
            ],

            'articles' => [
                'en' => [
                    'eyebrow' => 'Latest articles',
                    'title' => 'From the Rocheli desk',
                ],
                'fr' => [
                    'eyebrow' => 'Derniers articles',
                    'title' => 'Depuis le bureau Rocheli',
                ],
            ],
        ];

        foreach ($sections as $key => $content) {
            SiteContent::updateOrCreate(['page' => $page, 'key' => $key], ['content' => $content]);
        }
    }
}