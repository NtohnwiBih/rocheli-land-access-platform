<?php

namespace App\Notifications;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewEnquiryReceived extends Notification
{
    use Queueable;

    public function __construct(public Enquiry $enquiry)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $property = $this->enquiry->property;

        return (new MailMessage)
            ->subject('New property enquiry — ' . $property->titleForLocale('en'))
            ->line('Property: ' . $property->titleForLocale('en'))
            ->line('From: ' . $this->enquiry->contact_name)
            ->line('Phone: ' . $this->enquiry->contact_phone)
            ->when($this->enquiry->contact_email, fn (MailMessage $m) => $m->line('Email: ' . $this->enquiry->contact_email))
            ->when($this->enquiry->interest, fn (MailMessage $m) => $m->line('Interest: ' . $this->enquiry->interest))
            ->when($this->enquiry->message, fn (MailMessage $m) => $m->line($this->enquiry->message))
            ->action('View in admin', route('admin.enquiries.show', $this->enquiry));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'enquiry_id' => $this->enquiry->id,
            'name' => $this->enquiry->contact_name,
            'property' => $this->enquiry->property->titleForLocale('en'),
        ];
    }
}