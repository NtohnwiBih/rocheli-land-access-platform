import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Eyebrow } from "../section";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

type Props = {
  content?: {
    eyebrow?: string;
    title?: string;
    titleAccent?: string;
    subtitle?: string;
    features?: string[];
    ctaLabel?: string;
    secondaryCtaLabel?: string;
    cohortLabel?: string;
    image?: string;
  };
};

const fallbackPerks = [
  "Discounted access to premium inventory",
  "Free legal verification & title tracking",
  "Priority allocation windows every quarter",
  "Guaranteed buy-back on Prime tier",
  "Concierge relationship manager",
  "Private member-only property drops",
];

export default function ClubOverview({ content = {} }: Props) {
  const perks = content.features?.length ? content.features : fallbackPerks;

  return (
    <section className="py-24 bg-gradient-navy text-white relative overflow-hidden grain">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(50% 50% at 20% 20%, rgba(18,152,194,0.35), transparent 70%), radial-gradient(40% 40% at 80% 80%, rgba(255,210,26,0.2), transparent 70%)",
        }}
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden shadow-elegant">
            <img
              src={content.image || "/family-land.jpg"}
              alt="Rocheli members receiving their land title"
              loading="lazy"
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-gold text-navy">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-white">
                  {content.cohortLabel ?? "Cohort 11 · 100% allocated"}
                </div>
                <div className="text-xs text-white/70">312 members received titles in Q4 2025</div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 hidden md:block glass rounded-2xl p-5 max-w-[220px]">
            <div className="text-xs text-white/60 uppercase tracking-widest">Avg. member ROI</div>
            <div className="font-display text-3xl font-bold text-gradient-gold">+18.4%</div>
            <div className="text-xs text-white/70 mt-1">per annum since 2020</div>
          </div>
        </motion.div>

        <div>
          <Eyebrow className="border-white/20 bg-white/5 text-white">
            {content.eyebrow ?? "The Land Access Club"}
          </Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white">
            {content.title ?? "A structured savings program that ends with"}{" "}
            <span className="italic text-gradient-gold">
              {content.titleAccent ?? "a title in your name."}
            </span>
          </h2>
          <p className="mt-5 text-white/75 leading-relaxed max-w-xl">
            {content.subtitle ??
              "Contribute monthly at your pace. Reserve your plot from vetted inventory. Receive a legally-registered land title — no shortcuts, no surprises."}
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-white/85">
                <span className="mt-1 grid h-4 w-4 place-items-center rounded-full bg-gradient-gold text-navy shrink-0">
                  <ChevronRight className="h-3 w-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-gradient-gold text-navy rounded-full h-12 px-6 font-semibold hover:opacity-95"
            >
              <Link href="/land-access-club">
                {content.ctaLabel ?? "Explore membership"} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full h-12 px-6 border-white/30 bg-white/5 text-white hover:bg-white/15"
            >
              <Link href="/properties">{content.secondaryCtaLabel ?? "See eligible inventory"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}