<x-mail::message>
# New support request

**From:** {{ $userName }} ({{ $userEmail ?? 'no email on file' }})
@if($userPhone)
**Phone:** {{ $userPhone }}
@endif
@if($memberCode)
**Member ID:** {{ $memberCode }}
@endif
**Category:** {{ $category }}

**Subject:** {{ $subject }}

---

{{ $body }}

---

<x-mail::button :url="config('app.url') . '/admin'">
Open admin panel
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>