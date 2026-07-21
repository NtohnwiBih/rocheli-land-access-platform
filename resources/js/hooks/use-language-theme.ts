import { useCallback, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export type Locale = 'en' | 'fr';

const LANG_COOKIE = 'lang';
const THEME_KEY = 'theme';

function readLangCookie(): Locale {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
  return match?.[1] === 'fr' ? 'fr' : 'en';
}

function writeLangCookie(locale: Locale) {
  document.cookie = `${LANG_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

function readDarkPref(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

type Options = {
  reloadOnLanguageChange?: boolean;
};

export function useLanguageTheme(options: Options = {}) {
  const { i18n } = useTranslation();
  const [lang, setLangState] = useState<Locale>('en');
  const [dark, setDark] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const initialLang = readLangCookie();
    setLangState(initialLang);
    if (i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang);
    }
    setDark(readDarkPref());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    window.localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  const setLanguage = useCallback(
    (next: Locale) => {
      if (next === lang || switching) return;

      writeLangCookie(next);
      setLangState(next);
      i18n.changeLanguage(next);

      if (options.reloadOnLanguageChange) {
        setSwitching(true);
        router.reload({
          preserveUrl: true,
          onFinish: () => setSwitching(false),
        });
      }
    },
    [lang, switching, i18n, options.reloadOnLanguageChange],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(lang === 'en' ? 'fr' : 'en');
  }, [lang, setLanguage]);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  return { lang, setLanguage, toggleLanguage, dark, toggleDark, switching };
}