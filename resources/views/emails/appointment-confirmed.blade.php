{{-- resources/views/emails/appointment-confirmed.blade.php --}}
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
    <div style="background: #1a1a1a; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h1 style="color: #c9a84c; margin: 0; font-size: 20px;">Rocheli Real Properties</h1>
        <p style="color: #888; margin: 4px 0 0; font-size: 13px;">Consultation confirmed</p>
    </div>

    <h2 style="font-size: 18px;">Hi {{ $appointment->name }},</h2>
    <p style="color: #444; line-height: 1.6;">
        Your consultation is confirmed for
        <strong>{{ $appointment->date->format('l, F j, Y') }}</strong> at
        <strong>{{ $appointment->time->format('g:i A') }}</strong>.
    </p>
    <p style="color: #444; line-height: 1.6;">
        An advisor will reach out shortly beforehand to confirm the format (call, WhatsApp, or in person).
    </p>

    <div style="border-top: 1px solid #eee; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #aaa;">
        — Rocheli Real Properties
    </div>
</body>
</html>