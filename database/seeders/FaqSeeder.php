<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $generalFaqs = [
            [
                'en' => ['q' => 'What does Rocheli Real Properties do?', 'a' => 'We help clients find, verify, and acquire land and real estate across Cameroon, backed by legal title checks on every listing.'],
                'fr' => ['q' => 'Que fait Rocheli Real Properties ?', 'a' => 'Nous aidons les clients à trouver, vérifier et acquérir des terrains et biens immobiliers au Cameroun, avec une vérification légale du titre pour chaque annonce.'],
            ],
            [
                'en' => ['q' => 'How do I schedule a property visit?', 'a' => 'Book an appointment through our contact page and one of our agents will confirm a time that works for you.'],
                'fr' => ['q' => 'Comment planifier une visite de propriété ?', 'a' => 'Réservez un rendez-vous via notre page de contact et un agent confirmera un horaire qui vous convient.'],
            ],
            [
                'en' => ['q' => 'Do you offer support in French and English?', 'a' => 'Yes, our team and platform are fully bilingual.'],
                'fr' => ['q' => 'Offrez-vous un support en français et en anglais ?', 'a' => 'Oui, notre équipe et notre plateforme sont entièrement bilingues.'],
            ],
        ];

        $landAccessFaqs = [
            [
                'en' => ['q' => 'How do I join the Land Access Club?', 'a' => 'Create an account, choose a contribution plan, and complete your KYC — you can start contributing the same day.'],
                'fr' => ['q' => 'Comment rejoindre le Land Access Club ?', 'a' => 'Créez un compte, choisissez un plan de contribution et complétez votre KYC — vous pouvez commencer à contribuer le jour même.'],
            ],
            [
                'en' => ['q' => 'Are the properties legally verified?', 'a' => 'Yes. Every plot is title-audited and geo-mapped before it\'s listed to members.'],
                'fr' => ['q' => 'Les propriétés sont-elles légalement vérifiées ?', 'a' => 'Oui. Chaque parcelle est auditée et géo-cartographiée avant d\'être listée aux membres.'],
            ],
            [
                'en' => ['q' => 'What happens if I miss a monthly contribution?', 'a' => 'Your allocation simply pauses — there are no penalties, and you can resume anytime.'],
                'fr' => ['q' => 'Que se passe-t-il si je manque une contribution mensuelle ?', 'a' => 'Votre allocation est simplement mise en pause — sans pénalité, et vous pouvez reprendre à tout moment.'],
            ],
            [
                'en' => ['q' => 'Can I sell my property later?', 'a' => 'Yes, once your title is issued you own the property outright and can sell, lease, or develop it.'],
                'fr' => ['q' => 'Puis-je vendre ma propriété plus tard ?', 'a' => 'Oui, une fois votre titre émis, vous possédez la propriété en toute propriété et pouvez la vendre, la louer ou la développer.'],
            ],
            [
                'en' => ['q' => 'Do you finance construction?', 'a' => 'Not directly, but our team can connect you with vetted construction and financing partners.'],
                'fr' => ['q' => 'Financez-vous la construction ?', 'a' => 'Pas directement, mais notre équipe peut vous mettre en relation avec des partenaires de construction et de financement vérifiés.'],
            ],
        ];

        $this->seedFaqs($generalFaqs, isLandAccess: false, sortOffset: 0);
        $this->seedFaqs($landAccessFaqs, isLandAccess: true, sortOffset: count($generalFaqs));
    }

    private function seedFaqs(array $faqs, bool $isLandAccess, int $sortOffset): void
    {
        foreach ($faqs as $i => $f) {
            Faq::updateOrCreate(
                ['question->en' => $f['en']['q']],
                [
                    'question' => ['en' => $f['en']['q'], 'fr' => $f['fr']['q']],
                    'answer' => ['en' => $f['en']['a'], 'fr' => $f['fr']['a']],
                    'sort_order' => $sortOffset + $i + 1,
                    'is_published' => true,
                    'is_land_access' => $isLandAccess,
                ]
            );
        }
    }
}