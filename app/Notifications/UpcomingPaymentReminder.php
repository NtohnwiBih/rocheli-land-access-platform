<?php

namespace App\Notifications;

use App\Models\MemberPlan;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class UpcomingPaymentReminder extends Notification
{
    use Queueable;

    public function __construct(
        public MemberPlan $memberPlan,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $locale = $notifiable->preferred_locale ?? 'en';
        $due = $this->memberPlan->nextDueAt();
        $amount = number_format((float) $this->memberPlan->contribution_amount) . ' FCFA';
        $dueDate = $due?->format('M j, Y') ?? ($locale === 'fr' ? 'bientôt' : 'soon');

        if ($locale === 'fr') {
            return [
                'title' => 'Paiement à venir',
                'body' => "{$amount} dû pour {$this->memberPlan->displayName()} le {$dueDate}",
                'tone' => 'gold',
                'member_plan_id' => $this->memberPlan->id,
            ];
        }

        return [
            'title' => 'Upcoming payment',
            'body' => "{$amount} due for {$this->memberPlan->displayName()} on {$dueDate}",
            'tone' => 'gold',
            'member_plan_id' => $this->memberPlan->id,
        ];
    }
}