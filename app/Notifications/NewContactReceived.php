<?php

namespace App\Notifications;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class NewContactReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Contact $contact)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New contact message from ' . $this->contact->name)
            ->line('A new message came in through the site contact form.')
            ->line('Name: ' . $this->contact->name)
            ->line('Phone: ' . $this->contact->phone)
            ->when($this->contact->email, fn (MailMessage $mail) => $mail->line('Email: ' . $this->contact->email))
            ->when($this->contact->interest, fn (MailMessage $mail) => $mail->line('Interest: ' . $this->contact->interest))
            ->line($this->contact->message)
            ->action('View in admin', route('admin.contacts.index'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'contact_id' => $this->contact->id,
            'name' => $this->contact->name,
            'summary' => $this->contact->interest ?? Str::limit($this->contact->message, 80),
        ];
    }
}