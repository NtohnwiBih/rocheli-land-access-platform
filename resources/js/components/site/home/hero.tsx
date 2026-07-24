import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartHandshake, MapPin, Play, Sparkles, TrendingUp } from "lucide-react";

type HeroContent = {
  badge?: string;
  titleLine1?: string;
  titleLine2?: string;
  titleAccent?: string;
  subtitle?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryUrl?: string;
  watchStoryLabel?: string;
  heroImage?: string;
};

type StatsContent = {
  statMembersValue?: string;
  statMembersLabel?: string;
  statAcresValue?: string;
  statAcresLabel?: string;
  statContributionsValue?: string;
  statContributionsLabel?: string;
};

interface Props {
  content?: HeroContent;
  stats?: StatsContent;
}

function toNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatThousands(value: number): string {
  return value.toLocaleString("en-US");
}

export default function Hero({ content = {}, stats = {} }: Props) {
  const c = {
    badge: content.badge ?? "The Land Access Club · Cohort 12 now open",
    titleLine1: content.titleLine1 ?? "Own Land.",
    titleLine2: content.titleLine2 ?? "Build Wealth.",
    titleAccent: content.titleAccent ?? "Secure Your Future.",
    subtitle:
      content.subtitle ??
      "Join the Land Access Club and take a structured path toward verified land and property ownership across Cameroon's most promising cities.",
    ctaPrimaryLabel: content.ctaPrimaryLabel ?? "Become a Member",
    ctaSecondaryLabel: content.ctaSecondaryLabel ?? "Explore Properties",
    ctaPrimaryUrl: content.ctaPrimaryUrl || "/properties",
    ctaSecondaryUrl: content.ctaSecondaryUrl || "/land-access-club",
    watchStoryLabel: content.watchStoryLabel ?? "Watch the story",
    heroImage: content.heroImage || "/hero-land.jpg",
  };

  const membersValue = toNumber(stats.statMembersValue, 5000);
  const acresValue = toNumber(stats.statAcresValue, 15000);
  const contributionsValue = toNumber(stats.statContributionsValue, 2.5);

  const heroStats = [
    {
      value: `${formatThousands(membersValue)}+`,
      label: stats.statMembersLabel ?? "Members building wealth",
      icon: HeartHandshake,
    },
    {
      value: formatThousands(acresValue),
      label: stats.statAcresLabel ?? "Acres actively managed",
      icon: MapPin,
    },
    {
      value: `FCFA ${contributionsValue}B`,
      label: stats.statContributionsLabel ?? "Member contributions",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative -mt-20 min-h-[100svh] overflow-hidden grain">
      <img
        src={c.heroImage}
        alt="Aerial view of lush green land available for ownership in Cameroon"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/30 to-navy/70" />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-center pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {c.badge}
          </div>

          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.98] tracking-tight text-white">
            {c.titleLine1}
            <br />
            {c.titleLine2}
            <br />
            <span className="italic text-gradient-gold">{c.titleAccent}</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg text-white/80 leading-relaxed">{c.subtitle}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gradient-gold text-navy hover:opacity-95 rounded-full h-14 px-7 text-base font-semibold shadow-elegant"
            >
              <Link href={c.ctaPrimaryUrl}>
                {c.ctaPrimaryLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full h-14 px-6 text-base font-semibold border-white/30 bg-white/5 text-white hover:bg-white/15 backdrop-blur-md"
            >
              <Link href={c.ctaSecondaryUrl}>{c.ctaSecondaryLabel}</Link>
            </Button>
            <button className="inline-flex items-center gap-2.5 text-sm font-medium text-white/90 hover:text-gold transition">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur-md border border-white/25">
                <Play className="h-4 w-4 fill-white ml-0.5" />
              </span>
              {c.watchStoryLabel}
            </button>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.7 }}
              className="glass rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold text-navy shrink-0">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/70 truncate">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-widest hidden md:block">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          Scroll to discover ↓
        </motion.div>
      </div>
    </section>
  );
}