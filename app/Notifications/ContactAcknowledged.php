<?php

namespace App\Notifications;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactAcknowledged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Contact $contact)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('We received your message — Rocheli Real Properties')
            ->greeting('Hi ' . $this->contact->name . ',')
            ->line("Thanks for reaching out. A member of our team will get back to you within one business day.")
            ->line('Here\'s a copy of what you sent us:')
            ->line($this->contact->message);
    }
}