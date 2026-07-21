<?php

namespace App\Notifications;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewContactMessage extends Notification
{
    use Queueable;

    public function __construct(
        public ContactMessage $contact,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'New contact message',
            'body' => "{$this->contact->name}: {$this->contact->message}",
            'tone' => 'info',
            'link' => '/rocheli/contacts',
        ];
    }
}