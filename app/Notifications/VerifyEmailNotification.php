<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailNotification extends BaseVerifyEmail
{
    public function toMail($notifiable): MailMessage
    {
        $locale = $notifiable->preferred_locale ?? 'en';
        $url = $this->verificationUrl($notifiable);

        if ($locale === 'fr') {
            return (new MailMessage)
                ->subject('Vérifiez votre adresse e-mail')
                ->greeting('Bonjour ' . $notifiable->name . ',')
                ->line('Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail.')
                ->action('Vérifier mon e-mail', $url)
                ->line('Si vous n\'avez pas créé de compte, aucune action n\'est requise.')
                ->salutation('— Rocheli Real Properties');
        }

        return (new MailMessage)
            ->subject('Verify your email address')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Please click the button below to verify your email address.')
            ->action('Verify Email Address', $url)
            ->line('If you did not create an account, no further action is required.')
            ->salutation('— Rocheli Real Properties');
    }
}