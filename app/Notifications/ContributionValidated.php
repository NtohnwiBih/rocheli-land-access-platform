<?php

namespace App\Notifications;

use App\Models\Contribution;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ContributionValidated extends Notification
{
    use Queueable;

    public function __construct(
        public Contribution $contribution,
        public bool $approved,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $locale = $notifiable->preferred_locale ?? 'en';
        $amount = number_format((float) $this->contribution->amount) . ' FCFA';

        if ($locale === 'fr') {
            return [
                'title' => $this->approved ? 'Cotisation approuvée' : 'Cotisation rejetée',
                'body' => $this->approved
                    ? "Votre cotisation de {$amount} a été validée."
                    : "Votre cotisation de {$amount} n'a pas été approuvée" . ($this->contribution->rejection_reason ? " : {$this->contribution->rejection_reason}" : "."),
                'tone' => $this->approved ? 'success' : 'gold',
            ];
        }

        return [
            'title' => $this->approved ? 'Contribution approved' : 'Contribution rejected',
            'body' => $this->approved
                ? "Your contribution of {$amount} has been validated."
                : "Your contribution of {$amount} was not approved" . ($this->contribution->rejection_reason ? ": {$this->contribution->rejection_reason}" : "."),
            'tone' => $this->approved ? 'success' : 'gold',
        ];
    }
}