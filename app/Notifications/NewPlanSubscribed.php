<?php

namespace App\Notifications;

use App\Models\MemberPlan;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewPlanSubscribed extends Notification
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
        $member = $this->memberPlan->member->user->name;

        return [
            'title' => 'New project subscription',
            'body' => "{$member} started a new project: {$this->memberPlan->displayName()}.",
            'tone' => 'info',
            'link' => "/rocheli/members/{$this->memberPlan->member_id}",
        ];
    }
}