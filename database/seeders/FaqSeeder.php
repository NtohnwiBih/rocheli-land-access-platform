<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
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

        foreach ($faqs as $i => $f) {
            Faq::updateOrCreate(
                ['question->en' => $f['en']['q']],
                [
                    'question' => ['en' => $f['en']['q'], 'fr' => $f['fr']['q']],
                    'answer' => ['en' => $f['en']['a'], 'fr' => $f['fr']['a']],
                    'sort_order' => $i + 1,
                    'is_published' => true,
                ]
            );
        }
    }
}