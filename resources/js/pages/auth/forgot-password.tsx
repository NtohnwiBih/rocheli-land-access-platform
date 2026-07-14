import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { Mail } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type Props = {
    status?: string;
};

export default function ForgotPassword({ status }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    // Tracks whether we've successfully submitted in this "session" on the page,
    // separate from the server's `status` flash, so "Try another email" can
    // return to the form instantly without waiting on a round-trip.
    const [justSent, setJustSent] = useState(false);

    // If the server rendered this page with a `passwords.sent` flash (e.g. on
    // full page load / refresh after submitting), reflect that in local state too.
    useEffect(() => {
        if (status === 'passwords.sent') setJustSent(true);
    }, [status]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password', {
            preserveScroll: true,
            onSuccess: () => setJustSent(true),
        });
    };

    const tryAnotherEmail = () => {
        reset('email');
        setJustSent(false);
    };

    const sent = justSent;

    return (
        <>
            <Head title="Forgot password" />
            <AuthSplitLayout title="" description="">
                <Badge variant="secondary" className="mb-4">
                    Password Recovery
                </Badge>

                {!sent ? (
                    <>
                        <h1 className="font-display text-3xl font-black md:text-4xl">
                            Forgot your password?
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter the email associated with your account and we'll send you a secure
                            reset link.
                        </p>

                        <form className="mt-4 space-y-4" onSubmit={submit}>
                            <div>
                                <Label>Email address</Label>
                                <Input
                                    type="email"
                                    required
                                    autoFocus
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1.5"
                                    placeholder="you@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                variant="brand"
                                size="lg"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing ? 'Sending…' : 'Send reset link'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Remembered it?{' '}
                            <Link href="/login" className="font-semibold text-rocheli-blue">
                                Log in
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rocheli-blue/10 text-rocheli-blue">
                            <Mail className="h-7 w-7" />
                        </div>
                        <h1 className="font-display text-3xl font-black md:text-4xl">
                            Check your inbox
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            We've sent a password reset link to{' '}
                            <span className="font-semibold text-foreground">{data.email}</span>. The
                            link expires in 30 minutes.
                        </p>
                        <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                            <div className="font-medium text-foreground">Didn't get the email?</div>
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                <li>Check your spam or promotions folder</li>
                                <li>Make sure the email address is correct</li>
                                <li>Wait a minute — delivery can be delayed</li>
                            </ul>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={tryAnotherEmail}
                        >
                            Try another email
                        </Button>
                        <Link href="/login">
                            <Button variant="brand" className="w-full">
                                Back to login
                            </Button>
                        </Link>
                    </div>
                )}
            </AuthSplitLayout>
        </>
    );
}