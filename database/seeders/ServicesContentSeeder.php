<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class ServicesContentSeeder extends Seeder
{
    public function run(): void
    {
        $page = 'services';

        $sections = [
            'hero' => [
                'en' => [
                    'eyebrow' => 'Services',
                    'title' => 'A full real-estate stack,',
                    'titleAccent' => 'under one roof.',
                    'description' => 'From your first plot to a multi-asset portfolio — Rocheli\'s teams handle the sales, legal, management and advisory work end-to-end.',
                ],
                'fr' => [
                    'eyebrow' => 'Services',
                    'title' => 'Une offre immobilière complète,',
                    'titleAccent' => 'sous un même toit.',
                    'description' => 'De votre première parcelle à un portefeuille multi-actifs — les équipes de Rocheli gèrent la vente, le juridique, la gestion et le conseil de bout en bout.',
                ],
            ],

            'list' => [
                'en' => [
                    'items' => [
                        [
                            'icon' => 'Landmark',
                            'title' => 'Land Sales',
                            'body' => 'Curated inventory of title-verified plots in Cameroon\'s fastest-growing corridors, ready for outright or structured purchase.',
                            'points' => [['text' => 'Title-audited plots'], ['text' => 'Installment options'], ['text' => 'Legal handover']],
                        ],
                        [
                            'icon' => 'Building2',
                            'title' => 'Property Management',
                            'body' => 'Turnkey management of your land or built asset — from perimeter security and maintenance to leasing and reporting.',
                            'points' => [['text' => 'Security & upkeep'], ['text' => 'Tenant handling'], ['text' => 'Monthly reports']],
                        ],
                        [
                            'icon' => 'BadgeCheck',
                            'title' => 'Title Verification',
                            'body' => 'Independent legal audit of any land title, deed or purchase agreement. Know exactly what you\'re signing.',
                            'points' => [['text' => 'Land Conservation checks'], ['text' => 'Boundary survey'], ['text' => 'Encumbrance report']],
                        ],
                        [
                            'icon' => 'LineChart',
                            'title' => 'Investment Advisory',
                            'body' => 'Strategic guidance for individuals, family offices and institutions deploying capital into Cameroonian real estate.',
                            'points' => [['text' => 'Portfolio design'], ['text' => 'Deal sourcing'], ['text' => 'Exit planning']],
                        ],
                        [
                            'icon' => 'Briefcase',
                            'title' => 'Asset Management',
                            'body' => 'Long-term stewardship of real-estate portfolios with reporting, tax structuring and value-optimisation.',
                            'points' => [['text' => 'Reporting suite'], ['text' => 'Tax optimisation'], ['text' => 'Value engineering']],
                        ],
                        [
                            'icon' => 'ShieldCheck',
                            'title' => 'Real Estate Consulting',
                            'body' => 'Bespoke consulting for developers, corporates and public institutions on land, housing and infrastructure projects.',
                            'points' => [['text' => 'Feasibility studies'], ['text' => 'Master planning'], ['text' => 'Public-private partnerships']],
                        ],
                    ],
                ],
                'fr' => [
                    'items' => [
                        [
                            'icon' => 'Landmark',
                            'title' => 'Vente de terrains',
                            'body' => 'Inventaire sélectionné de parcelles à titre vérifié dans les corridors camerounais à plus forte croissance, prêtes pour un achat comptant ou structuré.',
                            'points' => [['text' => 'Parcelles auditées'], ['text' => 'Options de paiement échelonné'], ['text' => 'Remise juridique']],
                        ],
                        [
                            'icon' => 'Building2',
                            'title' => 'Gestion immobilière',
                            'body' => 'Gestion clé en main de votre terrain ou bien bâti — de la sécurité périmétrique et l\'entretien à la location et aux rapports.',
                            'points' => [['text' => 'Sécurité et entretien'], ['text' => 'Gestion des locataires'], ['text' => 'Rapports mensuels']],
                        ],
                        [
                            'icon' => 'BadgeCheck',
                            'title' => 'Vérification de titre',
                            'body' => 'Audit juridique indépendant de tout titre foncier, acte ou accord d\'achat. Sachez exactement ce que vous signez.',
                            'points' => [['text' => 'Vérifications au Conservateur foncier'], ['text' => 'Levé de bornage'], ['text' => 'Rapport de charges']],
                        ],
                        [
                            'icon' => 'LineChart',
                            'title' => 'Conseil en investissement',
                            'body' => 'Accompagnement stratégique pour particuliers, family offices et institutions déployant du capital dans l\'immobilier camerounais.',
                            'points' => [['text' => 'Conception de portefeuille'], ['text' => 'Sourcing de transactions'], ['text' => 'Planification de sortie']],
                        ],
                        [
                            'icon' => 'Briefcase',
                            'title' => 'Gestion d\'actifs',
                            'body' => 'Gestion à long terme de portefeuilles immobiliers avec reporting, structuration fiscale et optimisation de la valeur.',
                            'points' => [['text' => 'Suite de reporting'], ['text' => 'Optimisation fiscale'], ['text' => 'Ingénierie de la valeur']],
                        ],
                        [
                            'icon' => 'ShieldCheck',
                            'title' => 'Conseil immobilier',
                            'body' => 'Conseil sur mesure pour promoteurs, entreprises et institutions publiques sur les projets fonciers, de logement et d\'infrastructure.',
                            'points' => [['text' => 'Études de faisabilité'], ['text' => 'Planification directrice'], ['text' => 'Partenariats public-privé']],
                        ],
                    ],
                ],
            ],

            'cta' => [
                'en' => [
                    'title' => 'Not sure which service fits?',
                    'titleAccent' => 'Talk to us.',
                    'ctaPrimaryLabel' => 'Book a consultation',
                    'ctaSecondaryLabel' => 'See live inventory',
                ],
                'fr' => [
                    'title' => 'Vous ne savez pas quel service choisir ?',
                    'titleAccent' => 'Parlez-nous-en.',
                    'ctaPrimaryLabel' => 'Réserver une consultation',
                    'ctaSecondaryLabel' => 'Voir l\'inventaire en direct',
                ],
            ],
        ];

        foreach ($sections as $key => $content) {
            SiteContent::updateOrCreate(['page' => $page, 'key' => $key], ['content' => $content]);
        }
    }
}