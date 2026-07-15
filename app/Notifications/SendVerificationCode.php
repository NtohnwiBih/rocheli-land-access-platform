<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendVerificationCode extends Notification
{
    use Queueable;

    public function __construct(
        public string $code,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Rocheli verification code')
            ->greeting("Hello {$notifiable->name},")
            ->line('Use the code below to verify your email address.')
            ->line("**{$this->code}**")
            ->line('This code expires in 10 minutes.')
            ->line("If you didn't request this, you can safely ignore this email.");
    }
}