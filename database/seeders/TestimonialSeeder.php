<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        Testimonial::updateOrCreate(
            ['name' => 'Amina Nkeng'],
            [
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
                'is_published' => true,
            ]
        );
    }
}