<?php

namespace App\Notifications;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewContactSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected Contact $contact) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'New contact message',
            'body' => "{$this->contact->name}: " . str($this->contact->message)->limit(80),
            'tone' => 'info',
            'url' => route('admin.contact-center.index', ['tab' => 'contacts']),
        ];
    }
}