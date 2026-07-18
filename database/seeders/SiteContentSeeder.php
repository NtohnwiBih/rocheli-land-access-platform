<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $page = 'home';

        $sections = [
            'hero' => [
                'en' => [
                    'badge' => 'The Land Access Club — Cohort 12 Now Open',
                    'titleLine1' => 'Own Land.',
                    'titleLine2' => 'Build Wealth.',
                    'titleAccent' => 'Secure Your Future.',
                    'subtitle' => 'Join the Land Access Club and take a structured path toward verified land and property ownership across Cameroon\'s most promising cities.',
                    'ctaPrimaryLabel' => 'Become a Member',
                    'ctaSecondaryLabel' => 'Explore Properties',
                    'watchStoryLabel' => 'Watch the story',
                    'statMembersLabel' => 'Member funding waitlist',
                    'statPropertiesLabel' => 'Total acres managed',
                    'statContributionsLabel' => 'Member contributions',
                    'heroImage' => '',
                ],
                'fr' => [
                    'badge' => 'Le Club d\'Accès au Terrain — Cohorte 12 ouverte',
                    'titleLine1' => 'Possédez un terrain.',
                    'titleLine2' => 'Bâtissez la richesse.',
                    'titleAccent' => 'Sécurisez votre avenir.',
                    'subtitle' => 'Rejoignez le Land Access Club et suivez un parcours structuré vers la propriété foncière vérifiée dans les villes les plus prometteuses du Cameroun.',
                    'ctaPrimaryLabel' => 'Devenir membre',
                    'ctaSecondaryLabel' => 'Explorer les propriétés',
                    'watchStoryLabel' => 'Voir l\'histoire',
                    'statMembersLabel' => 'Liste d\'attente des membres',
                    'statPropertiesLabel' => 'Total d\'hectares gérés',
                    'statContributionsLabel' => 'Contributions des membres',
                    'heroImage' => '',
                ],
            ],

            'whyRocheli' => [
                'en' => [
                    'eyebrow' => 'Why Rocheli',
                    'title' => 'Built like a bank.',
                    'titleAccent' => 'Trusted like family.',
                    'subtitle' => 'We combine fintech-grade rigor with real-estate craftsmanship to make ownership secure, transparent, and inevitable.',
                    'features' => [
                        ['icon' => 'ShieldCheck', 'title' => 'Verified Properties', 'description' => 'Every plot is title-audited, geo-mapped, and legally cleared before it reaches our members.'],
                        ['icon' => 'CalendarClock', 'title' => 'Flexible Payment Plans', 'description' => 'Structured monthly contributions built around your income, not the market.'],
                        ['icon' => 'FileLock', 'title' => 'Secure Documentation', 'description' => 'Digital land titles, registered deeds, and lifetime access to your ownership records.'],
                        ['icon' => 'Headset', 'title' => 'Professional Support', 'description' => 'A dedicated relationship manager guides you from contribution to allocation.'],
                        ['icon' => 'TrendingUp', 'title' => 'Investment Growth', 'description' => 'Our properties historically appreciate 12–20% annually across active corridors.'],
                        ['icon' => 'Building2', 'title' => 'Property Management', 'description' => 'Optional development, rental, and resale support — powered by our operations team.'],
                    ],
                ],
                'fr' => [
                    'eyebrow' => 'Pourquoi Rocheli',
                    'title' => 'Construit comme une banque.',
                    'titleAccent' => 'De confiance comme une famille.',
                    'subtitle' => 'Nous combinons la rigueur fintech avec le savoir-faire immobilier pour rendre la propriété sûre, transparente et inévitable.',
                    'features' => [
                        ['icon' => 'ShieldCheck', 'title' => 'Propriétés vérifiées', 'description' => 'Chaque parcelle est auditée, géo-cartographiée et légalement dégagée avant d\'atteindre nos membres.'],
                        ['icon' => 'CalendarClock', 'title' => 'Plans de paiement flexibles', 'description' => 'Contributions mensuelles structurées selon vos revenus, pas selon le marché.'],
                        ['icon' => 'FileLock', 'title' => 'Documentation sécurisée', 'description' => 'Titres fonciers numériques, actes enregistrés et accès à vie à vos dossiers de propriété.'],
                        ['icon' => 'Headset', 'title' => 'Support professionnel', 'description' => 'Un gestionnaire de relation dédié vous accompagne de la contribution à l\'allocation.'],
                        ['icon' => 'TrendingUp', 'title' => 'Croissance de l\'investissement', 'description' => 'Nos propriétés s\'apprécient historiquement de 12 à 20% par an dans les corridors actifs.'],
                        ['icon' => 'Building2', 'title' => 'Gestion immobilière', 'description' => 'Support optionnel de développement, location et revente — assuré par notre équipe opérationnelle.'],
                    ],
                ],
            ],

            'savingsProgram' => [
                'en' => [
                    'eyebrow' => 'The Land Access Club',
                    'title' => 'A structured savings program',
                    'titleAccent' => 'that ends with a title in your name.',
                    'subtitle' => 'Contribute monthly at your pace. Reserve your plot from vetted inventory. Receive a legally registered land title — no shortcuts, no surprises.',
                    'features' => [
                        'Discounted access to premium inventory',
                        'Priority allocation weekly wins',
                        'Concierge relationship manager',
                        'Free legal verification & title tracking',
                        'Guaranteed buy-back on Prime tier',
                        'Private member-only property drops',
                    ],
                    'ctaLabel' => 'Join membership',
                    'secondaryCtaLabel' => 'See eligible inventory',
                    'cohortLabel' => 'Cohort 12 · 84% allocated',
                    'image' => '',
                ],
                'fr' => [
                    'eyebrow' => 'Le Land Access Club',
                    'title' => 'Un programme d\'épargne structuré',
                    'titleAccent' => 'qui se termine par un titre à votre nom.',
                    'subtitle' => 'Contribuez mensuellement à votre rythme. Réservez votre parcelle parmi un inventaire vérifié. Recevez un titre foncier légalement enregistré — sans raccourcis, sans surprises.',
                    'features' => [
                        'Accès à tarif réduit à l\'inventaire premium',
                        'Allocation prioritaire chaque semaine',
                        'Gestionnaire de relation dédié',
                        'Vérification juridique gratuite et suivi du titre',
                        'Rachat garanti sur le niveau Prime',
                        'Offres foncières réservées aux membres',
                    ],
                    'ctaLabel' => 'Rejoindre l\'adhésion',
                    'secondaryCtaLabel' => 'Voir l\'inventaire éligible',
                    'cohortLabel' => 'Cohorte 12 · 84% alloué',
                    'image' => '',
                ],
            ],

            'steps' => [
                'en' => [
                    'eyebrow' => 'How it works',
                    'title' => 'Four steps between you and',
                    'titleAccent' => 'your land title.',
                    'steps' => [
                        ['number' => '01', 'title' => 'Join the Club', 'description' => 'Choose a contribution plan aligned with your goals — Starter, Growth, Advance or Prime.'],
                        ['number' => '02', 'title' => 'Contribute Monthly', 'description' => 'Automated contributions build your allocation. Track everything from your dashboard.'],
                        ['number' => '03', 'title' => 'Reserve Property', 'description' => 'Once eligible, reserve your plot from vetted inventory across active corridors.'],
                        ['number' => '04', 'title' => 'Own Your Land', 'description' => 'Sign your registered deed, get your title, and step into ownership.'],
                    ],
                ],
                'fr' => [
                    'eyebrow' => 'Comment ça marche',
                    'title' => 'Quatre étapes entre vous et',
                    'titleAccent' => 'votre titre foncier.',
                    'steps' => [
                        ['number' => '01', 'title' => 'Rejoindre le Club', 'description' => 'Choisissez un plan de contribution aligné avec vos objectifs — Starter, Growth, Advance ou Prime.'],
                        ['number' => '02', 'title' => 'Contribuer mensuellement', 'description' => 'Des contributions automatisées construisent votre allocation. Suivez tout depuis votre tableau de bord.'],
                        ['number' => '03', 'title' => 'Réserver une propriété', 'description' => 'Une fois éligible, réservez votre parcelle parmi un inventaire vérifié dans les corridors actifs.'],
                        ['number' => '04', 'title' => 'Posséder votre terrain', 'description' => 'Signez votre acte enregistré, obtenez votre titre et entrez dans la propriété.'],
                    ],
                ],
            ],

            'testimonials' => [
                'en' => [
                    'eyebrow' => 'Member stories',
                    'title' => 'Real people.',
                    'titleAccent' => 'Real ownership.',
                    'subtitle' => 'Every quarter, hundreds of new members join the Club. Here are a few of their stories.',
                ],
                'fr' => [
                    'eyebrow' => 'Témoignages des membres',
                    'title' => 'Des gens réels.',
                    'titleAccent' => 'Une propriété réelle.',
                    'subtitle' => 'Chaque trimestre, des centaines de nouveaux membres rejoignent le Club. Voici quelques-unes de leurs histoires.',
                ],
            ],

            'faq' => [
                'en' => [
                    'eyebrow' => 'Questions',
                    'title' => 'Everything you were wondering.',
                ],
                'fr' => [
                    'eyebrow' => 'Questions',
                    'title' => 'Tout ce que vous vous demandiez.',
                ],
            ],

            'articles' => [
                'en' => [
                    'eyebrow' => 'Latest insights',
                    'title' => 'Notes from the Rocheli desk',
                ],
                'fr' => [
                    'eyebrow' => 'Dernières analyses',
                    'title' => 'Notes du bureau Rocheli',
                ],
            ],

            'cta' => [
                'en' => [
                    'eyebrow' => 'Ready when you are',
                    'title' => 'Talk to an advisor.',
                    'titleAccent' => 'Own land with confidence.',
                    'address' => 'Bonapriso, Douala, Cameroon',
                    'phone' => '+237 6XX XXX XXX',
                    'whatsapp' => '+237 6XX XXX XXX',
                    'ctaLabel' => 'Book my consultation',
                ],
                'fr' => [
                    'eyebrow' => 'Prêt quand vous l\'êtes',
                    'title' => 'Parlez à un conseiller.',
                    'titleAccent' => 'Possédez un terrain en toute confiance.',
                    'address' => 'Bonapriso, Douala, Cameroun',
                    'phone' => '+237 6XX XXX XXX',
                    'whatsapp' => '+237 6XX XXX XXX',
                    'ctaLabel' => 'Réserver ma consultation',
                ],
            ],

            'footer' => [
                'en' => [
                    'description' => 'A trusted real-estate savings platform helping members across Cameroon build wealth through verified land and property ownership.',
                    'phone' => '+237 6XX XXX XXX',
                    'email' => 'hello@rocheli.com',
                    'address' => 'Bonapriso, Douala, Cameroon',
                    'facebookUrl' => '',
                    'instagramUrl' => '',
                    'linkedinUrl' => '',
                    'twitterUrl' => '',
                ],
                'fr' => [
                    'description' => 'Une plateforme d\'épargne immobilière de confiance aidant les membres à travers le Cameroun à bâtir la richesse grâce à la propriété foncière vérifiée.',
                    'phone' => '+237 6XX XXX XXX',
                    'email' => 'hello@rocheli.com',
                    'address' => 'Bonapriso, Douala, Cameroun',
                    'facebookUrl' => '',
                    'instagramUrl' => '',
                    'linkedinUrl' => '',
                    'twitterUrl' => '',
                ],
            ],
        ];

        foreach ($sections as $key => $content) {
            SiteContent::updateOrCreate(
                ['page' => $page, 'key' => $key],
                ['content' => $content]
            );
        }
    }
}