<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Notifications\AppointmentConfirmed;
use Illuminate\Http\RedirectResponse;

class AppointmentActionController extends Controller
{
    public function confirm(Appointment $appointment): RedirectResponse
    {
        abort_if($appointment->status !== 'pending', 422, 'Already reviewed.');

        $appointment->update(['status' => 'confirmed', 'confirmed_at' => now()]);

        if ($appointment->email) {
            \Illuminate\Support\Facades\Notification::route('mail', $appointment->email)
                ->notify(new AppointmentConfirmed($appointment));
        }

        return back()->with('success', 'Appointment confirmed.');
    }

    public function cancel(Appointment $appointment): RedirectResponse
    {
        $appointment->update(['status' => 'cancelled']);

        return back()->with('success', 'Appointment cancelled.');
    }
}