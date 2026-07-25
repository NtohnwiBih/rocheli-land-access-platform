<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Amina Nkeng',
                'role' => [
                    'en' => 'Growth Plan Member · Yaoundé',
                    'fr' => 'Membre Growth Plan · Yaoundé',
                ],
                'quote' => [
                    'en' => 'I started with FCFA 50,000 monthly. Two years later I received my land title. Rocheli made ownership feel almost effortless.',
                    'fr' => 'J\'ai commencé avec 50 000 FCFA par mois. Deux ans plus tard, j\'ai reçu mon titre foncier. Rocheli a rendu la propriété presque sans effort.',
                ],
                'rating' => 5,
                'sort_order' => 1,
            ],
            [
                'name' => 'Ebenezer Fon',
                'role' => [
                    'en' => 'Starter Plan Member · Douala',
                    'fr' => 'Membre Starter Plan · Douala',
                ],
                'quote' => [
                    'en' => 'What sold me was the legal verification. I could see the title audit before I even reserved a plot. No stress, no guessing.',
                    'fr' => 'Ce qui m\'a convaincu, c\'est la vérification légale. J\'ai pu voir l\'audit du titre avant même de réserver une parcelle. Aucun stress, aucune supposition.',
                ],
                'rating' => 5,
                'sort_order' => 2,
            ],
            [
                'name' => 'Solange Mbezele',
                'role' => [
                    'en' => 'Premium Plan Member · Bafoussam',
                    'fr' => 'Membre Premium Plan · Bafoussam',
                ],
                'quote' => [
                    'en' => 'I missed two contributions during a rough patch and there was no penalty. That flexibility is why I stayed with the program.',
                    'fr' => 'J\'ai manqué deux contributions pendant une période difficile et il n\'y a eu aucune pénalité. Cette flexibilité est la raison pour laquelle je suis resté dans le programme.',
                ],
                'rating' => 4,
                'sort_order' => 3,
            ],
            [
                'name' => 'Patrick Ateba',
                'role' => [
                    'en' => 'Growth Plan Member · Kribi',
                    'fr' => 'Membre Growth Plan · Kribi',
                ],
                'quote' => [
                    'en' => 'The app made tracking my savings simple. Seeing my balance grow every month kept me motivated to stick with the plan.',
                    'fr' => 'L\'application a rendu le suivi de mon épargne simple. Voir mon solde augmenter chaque mois m\'a motivé à rester fidèle au plan.',
                ],
                'rating' => 5,
                'sort_order' => 4,
            ],
            [
                'name' => 'Grace Tabi',
                'role' => [
                    'en' => 'Starter Plan Member · Buea',
                    'fr' => 'Membre Starter Plan · Buea',
                ],
                'quote' => [
                    'en' => 'I recommended Rocheli to my whole family after receiving my title. Three of my siblings have since joined the Club.',
                    'fr' => 'J\'ai recommandé Rocheli à toute ma famille après avoir reçu mon titre. Trois de mes frères et sœurs ont depuis rejoint le Club.',
                ],
                'rating' => 5,
                'sort_order' => 5,
            ],
            [
                'name' => 'Joseph Ngwa',
                'role' => [
                    'en' => 'Premium Plan Member · Yaoundé',
                    'fr' => 'Membre Premium Plan · Yaoundé',
                ],
                'quote' => [
                    'en' => 'The advisors walked me through every step of the reservation process. It felt like private banking, not a real estate lottery.',
                    'fr' => 'Les conseillers m\'ont accompagné à chaque étape du processus de réservation. On se serait cru dans une banque privée, pas dans une loterie immobilière.',
                ],
                'rating' => 4,
                'sort_order' => 6,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::updateOrCreate(
                ['name' => $t['name']],
                [
                    'role' => $t['role'],
                    'quote' => $t['quote'],
                    'rating' => $t['rating'],
                    'sort_order' => $t['sort_order'],
                    'is_published' => true,
                ]
            );
        }
    }
}