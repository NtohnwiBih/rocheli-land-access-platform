<x-mail::message>
# Hi {{ $userName }},

Thanks for reaching out. We've received your message about **"{{ $subject }}"** and a member of our team will get back to you shortly.

If your matter is urgent, you can also reach us on WhatsApp using the number on your support page.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>