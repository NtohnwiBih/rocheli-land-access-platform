import { useState } from "react";
import { Link, useForm } from '@inertiajs/react';
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageThemeToggle } from "@/components/language-toggle";
import AppLogoIcon from "@/components/app-logo-icon";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLogin() {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  const { data, setData, post, processing, errors, reset } = useForm({
    login: "",
    password: "",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    post('/rocheli/login', {
      onFinish: () => reset('password'),
    });
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(700px 400px at 15% 10%, rgba(18,152,194,0.35), transparent), radial-gradient(500px 300px at 90% 90%, rgba(255,210,26,0.15), transparent)",
        }}
      />
      <div className="relative min-h-screen grid place-items-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-elegant p-8 md:p-10">
            <div className="relative flex items-center justify-between gap-3 mb-8">
               <Link href="/" className="flex items-center gap-2.5">
                    <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                </Link>
                <LanguageThemeToggle />
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 border border-gold/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold mb-3">
                <Lock className="h-3 w-3" />
                {t('adminLogin.secureArea')}
              </div>
               <h1 className="font-display text-3xl font-black md:text-4xl">
                {t('adminLogin.title')}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('adminLogin.subtitle')}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label>{t('login.email')}</Label>
                <Input
                  type="text"
                  autoFocus
                  value={data.login}
                  onChange={(e) => setData('login', e.target.value)}
                  placeholder={t('adminLogin.usernamePlaceholder')}
                  autoComplete="username"
                  className="mt-1.5"
                />
                {errors.login && <p className="mt-1 text-xs text-red-300">{errors.login}</p>}
              </div>

              <div>
                <Label>{t('adminLogin.password')}</Label>
                <div className="relative mt-2">
                  <Input
                    type={show ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={show ? t('adminLogin.hidePassword') : t('adminLogin.showPassword')}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                variant="brand"
                size="lg"
                className="w-full"
                disabled={processing}
              >
                {processing ? t('adminLogin.signingIn') : t('adminLogin.signIn')}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Rocheli Real Properties
          </div>
        </div>
      </div>
    </div>
  );
}