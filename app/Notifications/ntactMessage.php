<?php

namespace App\Notifications;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewContactMessage extends Notification
{
    use Queueable;

    public function __construct(
        public ContactMessage $contactMessage,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'New contact message',
            'body' => "{$this->contactMessage->name} sent a message" . ($this->contactMessage->interest ? " about {$this->contactMessage->interest}" : '') . '.',
            'tone' => 'info',
            'link' => '/rocheli/contacts?tab=contacts',
        ];
    }
}