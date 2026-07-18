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
        $due = $this->memberPlan->nextDueAt();

        return [
            'title' => 'Upcoming payment',
            'body' => sprintf(
                '%s due for %s on %s',
                number_format((float) $this->memberPlan->contribution_amount) . ' FCFA',
                $this->memberPlan->displayName(),
                $due?->format('M j, Y') ?? 'soon',
            ),
            'tone' => 'gold',
            'member_plan_id' => $this->memberPlan->id,
        ];
    }
}