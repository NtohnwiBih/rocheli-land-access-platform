<!DOCTYPE html>
<html lang="{{ $locale }}">
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
    <div style="background: #1a1a1a; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h1 style="color: #c9a84c; margin: 0; font-size: 20px;">Rocheli Real Properties</h1>
        <p style="color: #888; margin: 4px 0 0; font-size: 13px;">
            {{ $locale === 'fr' ? 'Bienvenue au Land Access Club' : 'Welcome to the Land Access Club' }}
        </p>
    </div>

    @if($locale === 'fr')
        <h2 style="font-size: 18px;">Bonjour {{ $user->name }},</h2>
        <p style="color: #444; line-height: 1.6;">
            Merci d'avoir rejoint le Land Access Club. Votre demande a été reçue et est en cours d'examen.
            Veuillez prendre un moment pour consulter l'accord régissant votre adhésion.
        </p>
    @else
        <h2 style="font-size: 18px;">Hello {{ $user->name }},</h2>
        <p style="color: #444; line-height: 1.6;">
            Thank you for joining the Land Access Club. Your application has been received and is being reviewed.
            Please take a moment to review the agreement governing your membership.
        </p>
    @endif

    <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
            <th style="text-align:left; background:#f5f5f5; padding:10px 12px; border-radius:8px 8px 0 0; font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#888;">
                {{ $agreementTitle }}
            </th>
        </tr>
        <tr>
            <td style="padding:14px 12px; border-bottom:1px solid #eee;">
                @if($agreementUrl)
                    <a href="{{ $agreementUrl }}" style="color:#c9a84c; font-weight:600; text-decoration:none;">
                        {{ $locale === 'fr' ? 'Consulter le document (PDF)' : 'View document (PDF)' }}
                    </a>
                @else
                    <span style="color:#999;">{{ $locale === 'fr' ? 'Pas encore disponible' : 'Not yet available' }}</span>
                @endif
            </td>
        </tr>
    </table>

    <p style="color: #444; line-height: 1.6;">
        {{ $locale === 'fr'
            ? 'Vous recevrez des mises à jour au fur et à mesure de l\'avancement de votre demande.'
            : 'You\'ll receive updates as your application progresses.' }}
    </p>

    <div style="border-top: 1px solid #eee; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #aaa;">
        — Rocheli Real Properties
    </div>
</body>
</html>