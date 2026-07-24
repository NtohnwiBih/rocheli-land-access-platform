@component('mail::message')
# You're booked, {{ $appointment->name }}

Your consultation with a Rocheli advisor is confirmed.

@component('mail::panel')
**Date:** {{ $appointment->appointment_date->translatedFormat('l, j F Y') }}
**Time:** {{ \Illuminate\Support\Carbon::parse($appointment->appointment_time)->format('H:i') }}
@endcomponent

Need to change or cancel? Just reply to this email and we'll take care of it.

Thanks,
The Rocheli Real Properties team
@endcomponent