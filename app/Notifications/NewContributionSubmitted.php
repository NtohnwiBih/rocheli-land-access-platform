<?php

namespace App\Notifications;

use App\Models\Contribution;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewContributionSubmitted extends Notification
{
    use Queueable;

    public function __construct(
        public Contribution $contribution,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $amount = number_format((float) $this->contribution->amount) . ' FCFA';
        $member = $this->contribution->memberPlan->member->user->name;

        return [
            'title' => 'New contribution submitted',
            'body' => "{$member} submitted {$amount} — awaiting validation.",
            'tone' => 'gold',
            'link' => "/rocheli/members/{$this->contribution->memberPlan->member_id}",
        ];
    }
}