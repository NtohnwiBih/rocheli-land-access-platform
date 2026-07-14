import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Moon, Sun, ChevronDown, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AuthNavLayout() {
  const { url } = usePage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<"EN" | "FR">("EN");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Inertia has no built-in "active link" concept (unlike TanStack Router),
  // so we derive it ourselves from the current visited URL.
  const isActive = (href: string) => (href === "/" ? url === "/" : url.startsWith(href));

  // Only the home page has a full-bleed dark hero behind the nav, so white
  // nav text only makes sense there. Every other route gets the "scrolled"
  // (solid background, dark text) treatment from the start, regardless of
  // actual scroll position.
  const isHome = url === "/";
  const solid = scrolled || !isHome;

  return (
    <>
      <header
        className={cn(
          solid
            ? "border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-card-soft"
            : "bg-transparent"
        )}
      >
        <div className="container-x flex h-18 items-center justify-between py-3">
          <Link href="/">
            <img
              src="/logo1.png"
              alt="Rocheli Real Properties"
              className="h-14 w-auto hidden md:inline-flex"
            />

            <img
              src="/logo.png"
              alt="Rocheli Real Properties"
              className="h-8 w-auto lg:hidden grid"
            />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "EN" ? "FR" : "EN")}
              className="items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
            >
              <Globe className="h-3.5 w-3.5 hidden md:inline-flex" />
              {lang}
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="place-items-center h-9 w-9 rounded-full border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button
              asChild
              className="bg-gradient-blue text-white shadow-glow hover:opacity-95 rounded-full px-5 h-10"
            >
              <Link href="/login">
                <Sparkles className="h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}