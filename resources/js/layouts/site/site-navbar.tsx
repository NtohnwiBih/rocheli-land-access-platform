import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Moon, Sun, ChevronDown, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/land-access-club", label: "Land Access Club" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-card-soft"
            : "bg-transparent"
        )}
      >
        <div className="container-x flex h-18 items-center justify-between py-3">
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <img
              src="/logo1.png"
              alt="Rocheli Real Properties"
              className="h-14 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3.5 py-2 text-sm font-medium transition-colors relative group",
                  solid
                    ? isActive(l.href) ? "text-primary" : "text-foreground/75 hover:text-foreground"
                    : isActive(l.href) ? "text-white" : "text-white/90 hover:text-white"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-[2px] bg-gradient-blue transition-transform duration-300 origin-left",
                    isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    !solid && "bg-white"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "EN" ? "FR" : "EN")}
              className="hidden md:flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang}
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="hidden md:grid place-items-center h-9 w-9 rounded-full border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button
              asChild
              className="hidden md:inline-flex bg-gradient-blue text-white shadow-glow hover:opacity-95 rounded-full px-5 h-10"
            >
              <Link href="/land-access-club">
                <Sparkles className="h-4 w-4" />
                Become a Member
              </Link>
            </Button>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden grid place-items-center h-10 w-10 rounded-full border border-border/70"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background shadow-elegant flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-display text-lg font-bold">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="grid place-items-center h-10 w-10 rounded-full border border-border"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium hover:bg-muted transition",
                      isActive(l.href) && "bg-primary/10 text-primary"
                    )}
                  >
                    {l.label}
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                ))}
              </nav>
              <div className="p-5 border-t border-border space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setLang(lang === "EN" ? "FR" : "EN")}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold"
                  >
                    <Globe className="h-3.5 w-3.5" /> {lang}
                  </button>
                  <button
                    onClick={() => setDark(!dark)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold"
                  >
                    {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    {dark ? "Light" : "Dark"}
                  </button>
                </div>
                <Button
                  asChild
                  className="w-full bg-gradient-blue text-white rounded-full h-11"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/land-access-club">
                    <Sparkles className="h-4 w-4" />
                    Become a Member
                  </Link>
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}