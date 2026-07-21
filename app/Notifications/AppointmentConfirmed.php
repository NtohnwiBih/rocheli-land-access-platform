<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentConfirmed extends Notification
{
    use Queueable;

    public function __construct(
        public Appointment $appointment,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $date = $this->appointment->appointment_date->translatedFormat('l, F j');
        $time = $this->appointment->appointment_time->format('H:i');

        return (new MailMessage)
            ->subject('Your appointment is confirmed')
            ->greeting('Hello ' . $this->appointment->name . ',')
            ->line("Your consultation with a Rocheli advisor is confirmed for {$date} at {$time}.")
            ->line('We look forward to speaking with you.')
            ->salutation('— Rocheli Real Properties');
    }
}