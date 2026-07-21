<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewAppointmentRequest extends Notification
{
    use Queueable;

    public function __construct(
        public Appointment $appointment,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $date = $this->appointment->appointment_date->format('M j');
        $time = $this->appointment->appointment_time->format('H:i');

        return [
            'title' => 'New appointment request',
            'body' => "{$this->appointment->name} requested {$date} at {$time}.",
            'tone' => 'info',
            'link' => '/rocheli/contacts?tab=appointments',
        ];
    }
}