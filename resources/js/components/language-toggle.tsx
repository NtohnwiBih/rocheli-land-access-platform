import { useEffect, useState } from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Lang = 'en' | 'fr';

export function LanguageThemeToggle() {
    const [dark, setDark] = useState(false);
    const { i18n } = useTranslation();

    // Derive display language directly from i18n's current language,
    // so there's a single source of truth instead of duplicated state.
    const lang = (i18n.language?.slice(0, 2).toLowerCase() as Lang) || 'en';

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
    }, [dark]);

    // On mount, restore the previously chosen language from sessionStorage
    useEffect(() => {
        const storedLang = (sessionStorage.getItem('language') as Lang) || 'fr';
        if (storedLang !== i18n.language) {
            i18n.changeLanguage(storedLang);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleLanguage = () => {
        const nextLang: Lang = lang === 'en' ? 'fr' : 'en';
        i18n.changeLanguage(nextLang);
        sessionStorage.setItem('language', nextLang);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
            >
                <Globe className="h-3.5 w-3.5" />
                {lang.toUpperCase()}
            </button>
            <button
                onClick={() => setDark(!dark)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-background/80 text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
                aria-label="Toggle theme"
            >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
        </div>
    );
}