<?php

namespace App\Notifications;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class EnquiryResponded extends Notification
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
        $locale = $notifiable->preferred_locale ?? 'en';
        $property = $this->enquiry->property->title;

        if ($locale === 'fr') {
            return [
                'title' => 'Réponse à votre demande',
                'body' => "Notre équipe a répondu à votre demande concernant {$property}.",
                'tone' => 'success',
                'link' => '/member/property',
            ];
        }

        return [
            'title' => 'Your enquiry was answered',
            'body' => "Our team responded to your enquiry about {$property}.",
            'tone' => 'success',
            'link' => '/member/property',
        ];
    }
}