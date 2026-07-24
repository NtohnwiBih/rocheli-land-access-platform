<?php

namespace App\Notifications;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewPropertyEnquiry extends Notification
{
    use Queueable;

    public function __construct(
        public Enquiry $enquiry,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $member = $this->enquiry->member->user->name;
        $property = $this->enquiry->property->titleForLocale(app()->getLocale());

        return [
            'title' => 'New property enquiry',
            'body' => "{$member} enquired about {$property}.",
            'tone' => 'info',
            'link' => "/rocheli/enquiries/{$this->enquiry->id}",
        ];
    }
}