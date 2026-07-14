import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { CheckCircle2, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

type Props = {
    token: string;
    email: string;
};

function scorePassword(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
}

export default function ResetPassword({ token, email }: Props) {
    const [show, setShow] = useState(false);
    const [done, setDone] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const score = useMemo(() => scorePassword(data.password), [data.password]);
    const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent'][score];
    const strengthColor = [
        'bg-destructive',
        'bg-destructive',
        'bg-rocheli-gold',
        'bg-rocheli-blue',
        'bg-rocheli-blue',
    ][score];

    const match = data.password.length > 0 && data.password === data.password_confirmation;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password', {
            preserveScroll: true,
            onSuccess: () => setDone(true),
            onError: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset password" />
            <AuthSplitLayout title="" description="">
                <Badge variant="secondary" className="mb-4">
                    Secure Reset
                </Badge>

                {!done ? (
                    <>
                        <h1 className="font-display text-3xl font-black md:text-4xl">
                            Create a new password
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Choose a strong password you haven't used before. It will secure your
                            account and wallet.
                        </p>

                        <form className="mt-8 space-y-5" onSubmit={submit}>
                            <div>
                                <Label>New password</Label>
                                <div className="relative mt-1.5">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type={show ? 'text' : 'password'}
                                        required
                                        autoFocus
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pl-9 pr-10"
                                        placeholder="At least 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShow((s) => !s)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                                        aria-label={show ? 'Hide password' : 'Show password'}
                                    >
                                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>
                                )}

                                {data.password && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex gap-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full ${
                                                        i < score ? strengthColor : 'bg-border'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Strength</span>
                                            <span className="font-medium">{strengthLabel}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label>Confirm password</Label>
                                <div className="relative mt-1.5">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type={show ? 'text' : 'password'}
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="pl-9"
                                        placeholder="Re-enter password"
                                    />
                                </div>
                                {data.password_confirmation && !match && (
                                    <p className="mt-1.5 text-xs text-destructive">
                                        Passwords do not match
                                    </p>
                                )}
                                {errors.password_confirmation && (
                                    <p className="mt-1.5 text-xs text-destructive">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <ul className="grid gap-1.5 rounded-2xl bg-muted/60 p-4 text-xs text-muted-foreground">
                                {[
                                    { ok: data.password.length >= 8, label: 'At least 8 characters' },
                                    { ok: /[A-Z]/.test(data.password), label: 'One uppercase letter' },
                                    { ok: /[0-9]/.test(data.password), label: 'One number' },
                                    {
                                        ok: /[^A-Za-z0-9]/.test(data.password),
                                        label: 'One special character',
                                    },
                                ].map((r) => (
                                    <li
                                        key={r.label}
                                        className={`flex items-center gap-2 ${
                                            r.ok ? 'text-foreground' : ''
                                        }`}
                                    >
                                        <CheckCircle2
                                            className={`h-3.5 w-3.5 ${
                                                r.ok ? 'text-rocheli-blue' : 'text-muted-foreground/50'
                                            }`}
                                        />
                                        {r.label}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                type="submit"
                                variant="brand"
                                size="lg"
                                className="w-full"
                                disabled={!match || score < 2 || processing}
                            >
                                {processing ? 'Resetting…' : 'Reset password'}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rocheli-blue/10 text-rocheli-blue">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <h1 className="font-display text-3xl font-black md:text-4xl">
                            Password updated
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Your password has been reset successfully. You can now log in to your
                            Land Access Club account.
                        </p>
                        <Link href="/login">
                            <Button variant="brand" size="lg" className="w-full rounded-full">
                                Continue to login
                            </Button>
                        </Link>
                    </div>
                )}
            </AuthSplitLayout>
        </>
    );
}