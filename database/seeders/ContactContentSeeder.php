<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class ContactContentSeeder extends Seeder
{
    public function run(): void
    {
        $page = 'contact';

        $sections = [
            'hero' => [
                'en' => [
                    'eyebrow' => 'Contact us',
                    'title' => 'Let\'s talk about your',
                    'titleAccent' => 'first plot.',
                    'description' => 'Book a 30-minute consultation with an advisor. Visit our office. Or ping us on WhatsApp — whichever works for you.',
                ],
                'fr' => [
                    'eyebrow' => 'Contactez-nous',
                    'title' => 'Parlons de votre',
                    'titleAccent' => 'première parcelle.',
                    'description' => 'Réservez une consultation de 30 minutes avec un conseiller. Visitez notre bureau. Ou contactez-nous sur WhatsApp — comme vous préférez.',
                ],
            ],

            'form' => [
                'en' => [
                    'title' => 'Send us a message',
                    'subtitle' => 'We\'ll respond within one business day.',
                ],
                'fr' => [
                    'title' => 'Envoyez-nous un message',
                    'subtitle' => 'Nous répondrons dans un jour ouvrable.',
                ],
            ],

            'booking' => [
                'en' => [
                    'title' => 'Book an advisor',
                    'body' => 'Pick a 30-minute slot with a Rocheli advisor. Available Mon–Sat.',
                ],
                'fr' => [
                    'title' => 'Réserver un conseiller',
                    'body' => 'Choisissez un créneau de 30 minutes avec un conseiller Rocheli. Disponible du lundi au samedi.',
                ],
            ],

            'whatsapp' => [
                'en' => [
                    'title' => 'Chat on WhatsApp',
                    'subtitle' => 'Response time under 15 minutes · 8am – 8pm',
                ],
                'fr' => [
                    'title' => 'Discuter sur WhatsApp',
                    'subtitle' => 'Temps de réponse inférieur à 15 minutes · 8h – 20h',
                ],
            ],

            'offices' => [
                'en' => [
                    'items' => [
                        ['city' => 'Yaoundé', 'address' => 'Bastos, Avenue de l\'Indépendance', 'phone' => '+237 6 55 11 11 11', 'hours' => 'Mon–Fri · 8am – 5pm'],
                    ],
                ],
                'fr' => [
                    'items' => [
                        ['city' => 'Yaoundé', 'address' => 'Bastos, Avenue de l\'Indépendance', 'phone' => '+237 6 55 11 11 11', 'hours' => 'Lun–Ven · 8h – 17h'],
                    ],
                ],
            ],
        ];

        foreach ($sections as $key => $content) {
            SiteContent::updateOrCreate(['page' => $page, 'key' => $key], ['content' => $content]);
        }
    }
}