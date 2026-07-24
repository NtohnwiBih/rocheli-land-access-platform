@component('mail::message')
# New appointment booked

**{{ $appointment->name }}** just booked a consultation slot.

@component('mail::panel')
**Date:** {{ $appointment->appointment_date->translatedFormat('l, j F Y') }}
**Time:** {{ \Illuminate\Support\Carbon::parse($appointment->appointment_time)->format('H:i') }}
**Phone:** {{ $appointment->phone }}
**Email:** {{ $appointment->email }}
**Interest:** {{ $appointment->interest ?? '—' }}
@endcomponent

@if($appointment->message)
> {{ $appointment->message }}
@endif
@endcomponent