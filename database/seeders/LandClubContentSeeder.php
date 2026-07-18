<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class LandClubContentSeeder extends Seeder
{
    public function run(): void
    {
        $page = 'land-club';

        $sections = [
            'hero' => [
                'en' => [
                    'eyebrow' => 'The Land Access Club',
                    'title' => 'Save monthly.',
                    'titleAccent' => 'Own land for life.',
                    'description' => 'A fintech-grade savings program that ends with a legally registered land title in your name — no lotteries, no shortcuts, no surprises.',
                    'ctaPrimaryLabel' => 'Start my membership',
                    'ctaSecondaryLabel' => 'Browse eligible properties',
                ],
                'fr' => [
                    'eyebrow' => 'Le Land Access Club',
                    'title' => 'Épargnez chaque mois.',
                    'titleAccent' => 'Possédez un terrain à vie.',
                    'description' => 'Un programme d\'épargne de niveau fintech qui se termine par un titre foncier légalement enregistré à votre nom — sans loterie, sans raccourci, sans surprise.',
                    'ctaPrimaryLabel' => 'Démarrer mon adhésion',
                    'ctaSecondaryLabel' => 'Parcourir les propriétés éligibles',
                ],
            ],

            'benefits' => [
                'en' => [
                    'eyebrow' => 'Why join',
                    'title' => 'Benefits designed like a private bank.',
                    'items' => [
                        ['icon' => 'ShieldCheck', 'title' => 'Verified inventory', 'body' => 'Every property in the Club is legally cleared before allocation.'],
                        ['icon' => 'Sparkles', 'title' => 'Priority access', 'body' => 'Members receive first look at every new development launch.'],
                        ['icon' => 'Landmark', 'title' => 'Structured savings', 'body' => 'Contribute monthly at your pace, without financial pressure.'],
                        ['icon' => 'Users', 'title' => 'Community', 'body' => 'Join 5,000+ Cameroonians building generational wealth together.'],
                    ],
                ],
                'fr' => [
                    'eyebrow' => 'Pourquoi adhérer',
                    'title' => 'Des avantages conçus comme une banque privée.',
                    'items' => [
                        ['icon' => 'ShieldCheck', 'title' => 'Inventaire vérifié', 'body' => 'Chaque propriété du Club est légalement dégagée avant allocation.'],
                        ['icon' => 'Sparkles', 'title' => 'Accès prioritaire', 'body' => 'Les membres ont un premier regard sur chaque nouveau lancement.'],
                        ['icon' => 'Landmark', 'title' => 'Épargne structurée', 'body' => 'Contribuez mensuellement à votre rythme, sans pression financière.'],
                        ['icon' => 'Users', 'title' => 'Communauté', 'body' => 'Rejoignez plus de 5 000 Camerounais qui bâtissent une richesse générationnelle ensemble.'],
                    ],
                ],
            ],

            'journey' => [
                'en' => [
                    'eyebrow' => 'Membership journey',
                    'title' => 'Your path from savings to signed title.',
                    'items' => [
                        ['month' => 'Month 0', 'title' => 'Sign up & KYC', 'body' => 'Choose a plan, verify identity, sign the member agreement.'],
                        ['month' => 'Month 1', 'title' => 'First contribution', 'body' => 'Automated monthly contribution begins. Track everything in-app.'],
                        ['month' => 'Month 6+', 'title' => 'Reservation window', 'body' => 'Once eligible, reserve your plot from vetted inventory.'],
                        ['month' => 'Final month', 'title' => 'Title transfer', 'body' => 'Sign your registered land title and receive your deed.'],
                    ],
                ],
                'fr' => [
                    'eyebrow' => 'Parcours d\'adhésion',
                    'title' => 'Votre chemin de l\'épargne au titre signé.',
                    'items' => [
                        ['month' => 'Mois 0', 'title' => 'Inscription et KYC', 'body' => 'Choisissez un plan, vérifiez votre identité, signez l\'accord de membre.'],
                        ['month' => 'Mois 1', 'title' => 'Première contribution', 'body' => 'La contribution mensuelle automatisée commence. Suivez tout dans l\'application.'],
                        ['month' => 'Mois 6+', 'title' => 'Fenêtre de réservation', 'body' => 'Une fois éligible, réservez votre parcelle parmi l\'inventaire vérifié.'],
                        ['month' => 'Dernier mois', 'title' => 'Transfert du titre', 'body' => 'Signez votre titre foncier enregistré et recevez votre acte.'],
                    ],
                ],
            ],

            'eligibility' => [
                'en' => [
                    'eyebrow' => 'Eligibility',
                    'title' => 'Simple, transparent requirements.',
                    'requirements' => [
                        ['text' => 'Cameroonian or resident foreign national'],
                        ['text' => '18 years or older'],
                        ['text' => 'Valid national ID or passport'],
                        ['text' => 'Verifiable source of monthly income'],
                        ['text' => 'Active phone number & email'],
                        ['text' => 'Signed member agreement'],
                    ],
                ],
                'fr' => [
                    'eyebrow' => 'Éligibilité',
                    'title' => 'Des conditions simples et transparentes.',
                    'requirements' => [
                        ['text' => 'Camerounais ou étranger résident'],
                        ['text' => '18 ans ou plus'],
                        ['text' => 'Carte d\'identité nationale ou passeport valide'],
                        ['text' => 'Source de revenu mensuel vérifiable'],
                        ['text' => 'Numéro de téléphone et email actifs'],
                        ['text' => 'Accord de membre signé'],
                    ],
                ],
            ],
        ];

        foreach ($sections as $key => $content) {
            SiteContent::updateOrCreate(['page' => $page, 'key' => $key], ['content' => $content]);
        }
    }
}