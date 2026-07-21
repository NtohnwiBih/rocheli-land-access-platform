<?php

namespace App\Mail;

use App\Models\LegalDocument;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMember extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
    ) {}

    public function build(): self
    {
        $locale = $this->user->preferred_locale ?? 'en';

        $agreement = LegalDocument::where('key', 'member_agreement')->first();

        return $this
            ->subject($locale === 'fr' ? 'Bienvenue chez Rocheli Real Properties' : 'Welcome to Rocheli Real Properties')
            ->view('emails.welcome-member', [
                'user' => $this->user,
                'locale' => $locale,
                'agreementTitle' => $agreement?->titleForLocale($locale) ?? 'Member Agreement',
                'agreementUrl' => $agreement?->urlForLocale($locale),
            ]);
    }
}