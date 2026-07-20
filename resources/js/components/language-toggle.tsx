import { Globe, Moon, Sun } from 'lucide-react';
import { useLanguageTheme } from '@/hooks/use-language-theme';
import { cn } from '@/lib/utils';

type Props = {
  /** Pass true on pages with a transparent/dark hero (e.g. home) so the
   *  buttons render in light text before the header goes solid. */
  solid?: boolean;
  /** Whether language changes should trigger an Inertia reload to refetch
   *  server-localized content. Nav needs this; auth screens usually don't. */
  reloadOnLanguageChange?: boolean;
  className?: string;
};

export function LanguageThemeToggle({ solid = true, reloadOnLanguageChange = false, className }: Props) {
  const { lang, dark, toggleLanguage, toggleDark, switching } = useLanguageTheme({
    reloadOnLanguageChange,
  });

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={toggleLanguage}
        disabled={switching}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur transition disabled:opacity-60',
          solid
            ? 'border-border/70 bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground'
            : 'border-white/30 bg-white/10 text-white/90 hover:border-white/50 hover:text-white'
        )}
      >
        <Globe className="h-3.5 w-3.5" />
        {switching ? '…' : lang.toUpperCase()}
      </button>
      <button
        onClick={toggleDark}
        className={cn(
          'grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition',
          solid
            ? 'border-border/70 bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground'
            : 'border-white/30 bg-white/10 text-white/90 hover:border-white/50 hover:text-white'
        )}
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}