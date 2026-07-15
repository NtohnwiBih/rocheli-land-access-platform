import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import {
    CheckCircle2,
    Mail,
    Phone,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react';

type Method = 'email' | 'phone';

type Props = {
    email?: string;
    phone?: string;
    status?: string;
    resendAvailableInSeconds?: number;
};

export default function VerifyAccount({
    email,
    phone,
    status,
    resendAvailableInSeconds = 45,
}: Props) {
    const { t } = useTranslation();

    // Phone is the primary verification channel — always open on Phone.
    const [method, setMethod] = useState<Method>('phone');
    const destination = method === 'email' ? email ?? '' : phone ?? '';
    const hasEmail = Boolean(email);

    // 6 digits for email codes, 4 digits for SMS codes
    const digits = method === 'email' ? 6 : 4;

    const [values, setValues] = useState<string[]>(() => Array(digits).fill(''));
    const [seconds, setSeconds] = useState(resendAvailableInSeconds);
    const [verified, setVerified] = useState(false);
    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        method,
    });

    useEffect(() => {
        setValues(Array(digits).fill(''));
        setSeconds(resendAvailableInSeconds);
        inputs.current = [];
        reset('code');
    }, [method, digits]);

    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds]);

    const copy = useMemo(() => {
        return method === 'email'
            ? {
                  eyebrow: t('verify.email.eyebrow'),
                  title: t('verify.email.title'),
                  desc: t('verify.email.desc'),
                  hint: t('verify.email.hint'),
                  channel: t('verify.email.channel'),
                  sideIcon: Mail,
              }
            : {
                  eyebrow: t('verify.phone.eyebrow'),
                  title: t('verify.phone.title'),
                  desc: t('verify.phone.desc'),
                  hint: t('verify.phone.hint'),
                  channel: t('verify.phone.channel'),
                  sideIcon: Phone,
              };
    }, [method, t]);

    const submitCode = (joined: string) => {
        setData((prev) => ({ ...prev, code: joined, method }));
        post('/verification.verify', {
            preserveScroll: true,
            onSuccess: () => setVerified(true),
            onError: () => {
                setValues(Array(digits).fill(''));
                inputs.current[0]?.focus();
            },
        });
    };

    const setDigit = (i: number, raw: string) => {
        const clean = raw.replace(/\D/g, '').slice(-1);
        const next = [...values];
        next[i] = clean;
        setValues(next);

        if (clean && i < digits - 1) inputs.current[i + 1]?.focus();

        if (next.every((d) => d !== '')) {
            submitCode(next.join(''));
        }
    };

    const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !values[i] && i > 0) inputs.current[i - 1]?.focus();
    };

    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits);
        if (!text) return;
        e.preventDefault();
        const next = Array(digits).fill('');
        for (let i = 0; i < text.length; i++) next[i] = text[i];
        setValues(next);
        inputs.current[Math.min(text.length, digits - 1)]?.focus();
        if (text.length === digits) submitCode(text);
    };

    const switchMethod = (m: Method) => {
        if (m === 'email' && !hasEmail) return;
        setMethod(m);
    };

    const resend = () => {
        router.post(
            '/verification.send',
            { method },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSeconds(resendAvailableInSeconds);
                    setValues(Array(digits).fill(''));
                    reset('code');
                },
            },
        );
    };

    return (
        <>
            <Head title={copy.title} />
            <AuthSplitLayout title="" description="">
                <Badge variant="secondary">{copy.eyebrow}</Badge>

                {!verified ? (
                    <>
                        <h1 className="mt-6 font-display text-3xl font-black md:text-4xl">
                            {copy.title}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {copy.desc}{' '}
                            <span className="font-semibold text-foreground">{destination}</span>.{' '}
                            {t('verify.instructions')}
                        </p>

                        {hasEmail && (
                            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1 text-sm">
                                <button
                                    type="button"
                                    onClick={() => switchMethod('phone')}
                                    className={`rounded-lg px-3 py-2 font-medium transition-colors ${
                                        method === 'phone'
                                            ? 'bg-card shadow-sm'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    <Phone className="mr-1 inline h-4 w-4" /> {t('verify.smsCode')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchMethod('email')}
                                    className={`rounded-lg px-3 py-2 font-medium transition-colors ${
                                        method === 'email'
                                            ? 'bg-card shadow-sm'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    <Mail className="mr-1 inline h-4 w-4" /> {t('verify.emailCode')}
                                </button>
                            </div>
                        )}

                        <div className="mt-6">
                            <div
                                className={`grid gap-2 sm:gap-3 ${
                                    method === 'email' ? 'grid-cols-6' : 'max-w-xs grid-cols-4'
                                }`}
                            >
                                {values.map((d, i) => (
                                    <input
                                        key={`${method}-${i}`}
                                        ref={(el) => {
                                            inputs.current[i] = el;
                                        }}
                                        value={d}
                                        onChange={(e) => setDigit(i, e.target.value)}
                                        onKeyDown={(e) => onKeyDown(i, e)}
                                        onPaste={onPaste}
                                        disabled={processing}
                                        inputMode="numeric"
                                        maxLength={1}
                                        aria-label={`Digit ${i + 1}`}
                                        className={`h-14 w-full rounded-xl border bg-card text-center font-display text-2xl font-bold outline-none transition-all focus:border-rocheli-blue focus:ring-2 focus:ring-rocheli-blue/20 ${
                                            errors.code
                                                ? 'border-destructive text-destructive'
                                                : 'border-border'
                                        }`}
                                    />
                                ))}
                            </div>
                            {errors.code && (
                                <p className="mt-3 text-sm text-destructive">{errors.code}</p>
                            )}
                        </div>

                        <div className="mt-8 flex items-center justify-between rounded-2xl bg-muted p-4 text-sm">
                            <span className="text-muted-foreground">
                                {t('verify.didntReceive')} {copy.channel}?
                            </span>
                            {seconds > 0 ? (
                                <span className="font-medium text-muted-foreground">
                                    {t('verify.resendIn')} {seconds}s
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={resend}
                                    className="inline-flex items-center gap-1.5 font-semibold text-rocheli-blue hover:underline"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" /> {t('verify.resendCode')}
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rocheli-blue/10 text-rocheli-blue">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <h1 className="font-display text-3xl font-black md:text-4xl">
                            {t('verify.success.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('verify.success.desc')}{' '}
                            {method === 'email' ? t('verify.emailWord') : t('verify.phoneNumberWord')}{' '}
                            {t('verify.success.descSuffix')}
                        </p>
                        <ul className="space-y-2 text-sm">
                            {[
                                t('verify.success.wallet'),
                                t('verify.success.referral'),
                                t('verify.success.access'),
                            ].map((c) => (
                                <li key={c} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-rocheli-blue" /> {c}
                                </li>
                            ))}
                        </ul>
                        <Link href="/dashboard">
                            <Button variant="brand" size="lg" className="w-full">
                                {t('verify.success.goToDashboard')}
                            </Button>
                        </Link>
                    </div>
                )}

                {status && (
                    <div className="mt-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </AuthSplitLayout>
        </>
    );
}