import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [mode, setMode] = useState<"email" | "phone">("email");
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
        <Head title="Log in" />
        <AuthSplitLayout>

        <div className="flex flex-col justify-between">
        <Link href="/"></Link>
        <div className="mx-auto w-full max-w-md py-10">
          <Badge variant="secondary" className="mb-4">Member Portal</Badge>
          <h1 className="font-display text-3xl font-black md:text-4xl">{t('login.welcomeBack')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('login.subtitle')}</p>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1 text-sm">
            <button
                type="button"
                onClick={() => setMode('email')}
                className={`rounded-lg px-3 py-2 font-medium transition-colors ${
                    mode === 'email' ? 'bg-card shadow-sm' : 'text-muted-foreground'
                }`}
            >
                <Mail className="mr-1 inline h-4 w-4" /> {t('login.email')}
            </button>
            <button
                type="button"
                onClick={() => setMode('phone')}
                className={`rounded-lg px-3 py-2 font-medium transition-colors ${
                    mode === 'phone' ? 'bg-card shadow-sm' : 'text-muted-foreground'
                }`}
            >
                <Phone className="mr-1 inline h-4 w-4" /> {t('login.phone')}
            </button>
          </div>

          {status && (
            <div className="mt-4 text-center text-sm font-medium text-green-600">
              {status}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <Label>{mode === 'email' ? t('login.email') : t('login.phoneNumber')}</Label>
              <Input
                className="mt-1.5"
                value={data.login}
                onChange={(e) => setData('login', e.target.value)}
                placeholder={mode === "email" ? t('login.emailPlaceholder') : t('login.phonePlaceholder')}
                autoComplete="username"
                autoFocus
              />
              {errors.login && <p className="mt-1 text-xs text-destructive">{errors.login}</p>}
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <Label>{t('login.password')}</Label>
                    {canResetPassword && (
                        <Link href="/forgot-password" className="text-xs font-medium text-rocheli-blue hover:underline">
                            Forgot?
                        </Link>
                    )}
                </div>
                <div className="relative mt-1.5">
                    <Input
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    className="pr-10"
                    autoComplete="current-password"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={data.remember}
                onCheckedChange={(checked) => setData('remember', Boolean(checked))}
              />
              {t('login.rememberMe')}
            </label>
            <Button type="submit" variant="brand" size="lg" className="w-full" disabled={processing}>
              {processing ? '...' : t('login.submit')}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t('login.newHere')}{' '} <Link href="/register" className="font-semibold text-rocheli-blue">{t('login.createAccount')}</Link>
          </div>
        </div>
      </div>

            </AuthSplitLayout>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};