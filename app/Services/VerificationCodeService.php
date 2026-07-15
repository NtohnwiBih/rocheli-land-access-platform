<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\SendVerificationCode;
use Illuminate\Support\Facades\Cache;

class VerificationCodeService
{
    public function __construct(
        protected SmsService $sms,
    ) {}

    public function issue(User $user, string $method): void
    {
        $code = $this->generateCode($method);

        Cache::put($this->key($user, $method), $code, now()->addMinutes(10));

        if ($method === 'email') {
            $user->notify(new SendVerificationCode($code));
        } else {
            $this->sms->send(
                $user->phone,
                "Associated with Rocheli Real Properties {$code}"
            );
        }
    }

    public function verify(User $user, string $method, string $code): bool
    {
        $key = $this->key($user, $method);
        $expected = Cache::get($key);

        if (! $expected || ! hash_equals($expected, $code)) {
            return false;
        }

        Cache::forget($key);

        if ($method === 'email') {
            $user->forceFill(['email_verified_at' => now()])->save();
        } else {
            $user->forceFill(['phone_verified_at' => now()])->save();
        }

        return true;
    }

    protected function generateCode(string $method): string
    {
        return $method === 'email'
            ? (string) random_int(100000, 999999)
            : (string) random_int(1000, 9999);
    }

    protected function key(User $user, string $method): string
    {
        return "verify:{$user->id}:{$method}";
    }
}