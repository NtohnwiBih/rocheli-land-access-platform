<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class AboutContentSeeder extends Seeder
{
    public function run(): void
    {
        $page = 'about';

        $sections = [
            'hero' => [
                'en' => [
                    'eyebrow' => 'Our story',
                    'title' => 'Building the trusted',
                    'titleAccent' => 'bridge to land in Cameroon.',
                    'description' => 'Rocheli was born from a simple observation: land ownership in Cameroon should be secure, structured and accessible — not a maze. We built a platform, a legal engine, and a members\' club to make it so.',
                ],
                'fr' => [
                    'eyebrow' => 'Notre histoire',
                    'title' => 'Construire le pont de confiance',
                    'titleAccent' => 'vers la terre au Cameroun.',
                    'description' => 'Rocheli est né d\'un constat simple : la propriété foncière au Cameroun devrait être sûre, structurée et accessible — pas un labyrinthe. Nous avons construit une plateforme, un moteur juridique et un club de membres pour y parvenir.',
                ],
            ],

            'story' => [
                'en' => [
                    'eyebrow' => 'Company story',
                    'title' => 'From a small team of',
                    'titleAccent' => 'believers to a movement of 5,000+ members.',
                    'paragraph1' => 'Founded in Douala in 2019, Rocheli started with 12 members and one 5-hectare parcel. Today we manage 15,000 acres across Douala, Yaoundé, Kribi, Buea and Bafoussam — and have transferred more than 2,000 land titles into member hands.',
                    'paragraph2' => 'Our conviction is unchanged: verified land, structured savings and radical transparency are the shortest path to generational wealth in Central Africa.',
                    'image' => '/family-land.jpg',
                ],
                'fr' => [
                    'eyebrow' => 'Histoire de l\'entreprise',
                    'title' => 'D\'une petite équipe de',
                    'titleAccent' => 'croyants à un mouvement de plus de 5 000 membres.',
                    'paragraph1' => 'Fondée à Douala en 2019, Rocheli a débuté avec 12 membres et une parcelle de 5 hectares. Aujourd\'hui, nous gérons 15 000 hectares à Douala, Yaoundé, Kribi, Buea et Bafoussam — et avons transféré plus de 2 000 titres fonciers entre les mains de nos membres.',
                    'paragraph2' => 'Notre conviction reste inchangée : un terrain vérifié, une épargne structurée et une transparence radicale sont le chemin le plus court vers une richesse générationnelle en Afrique centrale.',
                    'image' => '/family-land.jpg',
                ],
            ],

            'mission' => [
                'en' => [
                    'values' => [
                        ['icon' => 'Target', 'title' => 'Mission', 'body' => 'Make verified land ownership accessible to every ambitious Cameroonian through structured, transparent programs.'],
                        ['icon' => 'Eye', 'title' => 'Vision', 'body' => 'A generation of African families whose wealth is anchored in land they legally, unquestionably own.'],
                        ['icon' => 'Heart', 'title' => 'Values', 'body' => 'Integrity above expedience. Transparency by default. Excellence at every touchpoint. Members before margins.'],
                    ],
                ],
                'fr' => [
                    'values' => [
                        ['icon' => 'Target', 'title' => 'Mission', 'body' => 'Rendre la propriété foncière vérifiée accessible à tout Camerounais ambitieux grâce à des programmes structurés et transparents.'],
                        ['icon' => 'Eye', 'title' => 'Vision', 'body' => 'Une génération de familles africaines dont la richesse repose sur des terres qu\'elles possèdent légalement et incontestablement.'],
                        ['icon' => 'Heart', 'title' => 'Valeurs', 'body' => 'L\'intégrité avant l\'opportunisme. La transparence par défaut. L\'excellence à chaque étape. Les membres avant les marges.'],
                    ],
                ],
            ],

            'leadership' => [
                'en' => [
                    'eyebrow' => 'Leadership',
                    'title' => 'The people building Rocheli',
                    'description' => 'A senior team spanning real estate, law, finance and technology.',
                ],
                'fr' => [
                    'eyebrow' => 'Direction',
                    'title' => 'Les personnes qui construisent Rocheli',
                    'description' => 'Une équipe expérimentée couvrant l\'immobilier, le droit, la finance et la technologie.',
                ],
            ],
        ];

        foreach ($sections as $key => $content) {
            SiteContent::updateOrCreate(['page' => $page, 'key' => $key], ['content' => $content]);
        }
    }
}