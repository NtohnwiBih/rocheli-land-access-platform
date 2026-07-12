import type { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "./section";

export interface BreadcrumbSearchProps {
  /** Current search input value. */
  value: string;
  /** Called with the new value on every keystroke. */
  onChange: (value: string) => void;
  /** Input placeholder text. */
  placeholder?: string;
  /** Currently selected city/location filter. Omit the whole select by leaving `cities` empty. */
  city?: string;
  onCityChange?: (city: string) => void;
  /** Options for the location dropdown. If omitted (or empty), the dropdown isn't rendered. */
  cities?: string[];
  /** Called when the search button is clicked. */
  onSubmit?: () => void;
  /** Text on the search button. */
  buttonLabel?: string;
}

export interface BreadcrumbButton {
  /** Button text. */
  label: ReactNode;
  /** Destination for the link. */
  href: string;
  /** "solid" (default) is the gold filled CTA; "outline" is the glass/bordered style. */
  variant?: "solid" | "outline";
  /** Optional icon rendered after the label, e.g. <ArrowRight className="h-4 w-4" />. */
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  /** Small pill label above the title, e.g. "Marketplace". */
  eyebrow: ReactNode;
  /** Page title. Pass JSX directly if part of it needs the gold-italic highlight. */
  title: ReactNode;
  /** Optional supporting copy below the title. */
  description?: ReactNode;
  /** Optional CTA buttons rendered below the description (or search, if both are provided). */
  buttons?: BreadcrumbButton[];
  /** Optional built-in search bar. Omit entirely to render the breadcrumb without one. */
  search?: BreadcrumbSearchProps;
  /** Optional extra content rendered under everything else — filters, tags, breadcrumb trails, etc. */
  children?: ReactNode;
  /** Extra classes merged onto the outer <section>. */
  className?: string;
  /** Position of the ambient radial glow behind the content. */
  glowPosition?: string;
}

export function Breadcrumb({
  eyebrow,
  title,
  description,
  buttons,
  search,
  children,
  className,
  glowPosition = "80% 20%",
}: BreadcrumbProps) {
  return (
    <section
      className={cn(
        "relative py-16 md:py-20 bg-gradient-navy text-white overflow-hidden grain",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background: `radial-gradient(40% 60% at ${glowPosition}, rgba(18,152,194,0.4), transparent 60%)`,
        }}
      />
      <div className="container-x relative">
        <Eyebrow className="border-white/20 bg-white/5 text-white">{eyebrow}</Eyebrow>

        <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight max-w-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 text-white/70 max-w-xl">{description}</p>
        )}

        {buttons && buttons.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-3">
            {buttons.map((b, i) => (
              <Button
                key={i}
                asChild
                variant={b.variant === "outline" ? "outline" : undefined}
                className={cn(
                  "rounded-full h-14 px-6 font-semibold",
                  b.variant === "outline"
                    ? "border-white/30 bg-white/5 text-white hover:bg-white/15"
                    : "bg-gradient-gold text-navy px-7 hover:opacity-95"
                )}
              >
                <Link href={b.href}>
                  {b.label}
                  {b.icon}
                </Link>
              </Button>
            ))}
          </div>
        )}

        {search && (
          <div className="mt-8 glass rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="h-4 w-4 text-white/60" aria-hidden="true" />
              <input
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                placeholder={search.placeholder ?? "Search…"}
                className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/50 outline-none min-w-0"
              />
            </div>

            {search.cities && search.cities.length > 0 && (
              <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-white/15">
                <MapPin className="h-4 w-4 text-white/60" aria-hidden="true" />
                <select
                  value={search.city}
                  onChange={(e) => search.onCityChange?.(e.target.value)}
                  className="bg-transparent py-3 text-sm text-white outline-none min-w-0"
                >
                  {search.cities.map((c) => (
                    <option key={c} value={c} className="text-navy">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              type="button"
              onClick={search.onSubmit}
              className="bg-gradient-gold text-navy hover:opacity-95 rounded-xl h-11 sm:h-auto sm:w-auto px-6 font-semibold"
            >
              {search.buttonLabel ?? "Search"}
            </Button>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}