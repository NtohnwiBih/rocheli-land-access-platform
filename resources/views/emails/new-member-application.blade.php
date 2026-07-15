<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
    <div style="background: #1a1a1a; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h1 style="color: #c9a84c; margin: 0; font-size: 20px;">Rocheli Real Properties</h1>
        <p style="color: #888; margin: 4px 0 0; font-size: 13px;">Land Access Club — New Member Application</p>
    </div>

    <h2 style="font-size: 18px; margin-bottom: 4px;">👤 {{ $member->user->name }}</h2>
    <p style="color: #555; margin: 0 0 24px;">Submitted on {{ $member->submitted_at->format('F j, Y \a\t g:i A') }}</p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr><th colspan="2" style="text-align:left; background:#f5f5f5; padding:10px 12px; border-radius:8px 8px 0 0; font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#888;">Personal Information</th></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555; width:40%;">Phone</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->user->phone }}</td></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555;">Email</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->user->email ?? '—' }}</td></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555;">WhatsApp</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->whatsapp ?? '—' }}</td></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555;">Occupation</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->occupation ?? '—' }}</td></tr>
        <tr><td style="padding:10px 12px; color:#555;">City</td><td style="padding:10px 12px;">{{ $member->city }}</td></tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr><th colspan="2" style="text-align:left; background:#f5f5f5; padding:10px 12px; border-radius:8px 8px 0 0; font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#888;">Next of Kin</th></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555; width:40%;">Name</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->kin_name ?? '—' }}</td></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555;">Relationship</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->kin_relationship ?? '—' }}</td></tr>
        <tr><td style="padding:10px 12px; color:#555;">Phone</td><td style="padding:10px 12px;">{{ $member->kin_phone ?? '—' }}</td></tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr><th colspan="2" style="text-align:left; background:#f5f5f5; padding:10px 12px; border-radius:8px 8px 0 0; font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#888;">Property Goal</th></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555; width:40%;">Goal</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->goal }}</td></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555;">Preferred Locations</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ implode(', ', $member->preferred_locations ?? []) }}</td></tr>
        <tr><td style="padding:10px 12px; color:#555;">Land Type</td><td style="padding:10px 12px;">{{ $member->land_type }}</td></tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr><th colspan="2" style="text-align:left; background:#f5f5f5; padding:10px 12px; border-radius:8px 8px 0 0; font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#888;">Plan & Contribution</th></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555; width:40%;">Plan</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->plan }}</td></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555;">Frequency</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ $member->contribution_frequency }}</td></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555;">Amount</td><td style="padding:10px 12px; border-bottom:1px solid #eee;">{{ number_format($member->contribution_amount) }} FCFA</td></tr>
        <tr><td style="padding:10px 12px; color:#555;">Payment Method</td><td style="padding:10px 12px;">{{ $member->payment_method }}</td></tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
        <tr><th colspan="2" style="text-align:left; background:#f5f5f5; padding:10px 12px; border-radius:8px 8px 0 0; font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#888;">Confirmation</th></tr>
        <tr><td style="padding:10px 12px; border-bottom:1px solid #eee; color:#555; width:40%;">Digital Signature</td><td style="padding:10px 12px; border-bottom:1px solid #eee; font-style:italic;">{{ $member->signature }}</td></tr>
        <tr><td style="padding:10px 12px; color:#555;">Date</td><td style="padding:10px 12px;">{{ $member->agreed_at->format('F j, Y \a\t g:i A') }}</td></tr>
    </table>

    <div style="border-top: 1px solid #eee; padding-top: 16px; font-size: 12px; color: #aaa;">
        This application was submitted via the Rocheli Real Properties website.
    </div>
</body>
</html>