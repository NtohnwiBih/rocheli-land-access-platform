import { Breadcrumb } from "@/components/site/breadcrumbs";
import FAQ from "@/components/site/home/faqs";
import { Plans } from "@/components/site/plans";
import { SectionHeader } from "@/components/site/section";
import { Head } from "@inertiajs/react";
import { ArrowRight, Check, Rocket } from "lucide-react";
import { motion } from "motion/react";
import { resolveIcon } from "@/lib/icon-map";

type BenefitItem = { icon: string; title: string; body: string };
type JourneyItem = { month: string; title: string; body: string };

type Props = {
  content: {
    hero?: { eyebrow?: string; title?: string; titleAccent?: string; description?: string; ctaPrimaryLabel?: string; ctaSecondaryLabel?: string };
    benefits?: { eyebrow?: string; title?: string; items?: BenefitItem[] };
    journey?: { eyebrow?: string; title?: string; items?: JourneyItem[] };
    eligibility?: { eyebrow?: string; title?: string; requirements?: { text: string }[] };
  };
  testimonials: { id: number; name: string; role: string; quote: string; rating: number; avatar: string | null }[];
  faqs: { id: number; question: string; answer: string }[];
};

const fallbackBenefits: BenefitItem[] = [
  { icon: "ShieldCheck", title: "Verified inventory", body: "Every property in the Club is legally cleared before allocation." },
  { icon: "Sparkles", title: "Priority access", body: "Members receive first look at every new development launch." },
  { icon: "Landmark", title: "Structured savings", body: "Contribute monthly at your pace, without financial pressure." },
  { icon: "Users", title: "Community", body: "Join 5,000+ Cameroonians building generational wealth together." },
];

const fallbackJourney: JourneyItem[] = [
  { month: "Month 0", title: "Sign up & KYC", body: "Choose a plan, verify identity, sign the member agreement." },
  { month: "Month 1", title: "First contribution", body: "Automated monthly contribution begins. Track everything in-app." },
  { month: "Month 6+", title: "Reservation window", body: "Once eligible, reserve your plot from vetted inventory." },
  { month: "Final month", title: "Title transfer", body: "Sign your registered land title and receive your deed." },
];

const fallbackRequirements = [
  { text: "Cameroonian or resident foreign national" },
  { text: "18 years or older" },
  { text: "Valid national ID or passport" },
  { text: "Verifiable source of monthly income" },
  { text: "Active phone number & email" },
  { text: "Signed member agreement" },
];

export default function LandClub({ content = {}, testimonials, faqs }: Props) {
  const hero = content.hero ?? {};
  const benefits = content.benefits?.items?.length ? content.benefits.items : fallbackBenefits;
  const journey = content.journey?.items?.length ? content.journey.items : fallbackJourney;
  const requirements = content.eligibility?.requirements?.length ? content.eligibility.requirements : fallbackRequirements;

  return (
    <>
      <Head title="The Land Access Club — Rocheli Real Properties">
        <meta
          name="description"
          content="Save monthly. Reserve verified land. Receive a registered title. Join Cameroon's most trusted ownership program."
        />
        <meta property="og:title" content="The Land Access Club" />
        <meta property="og:description" content="A structured savings program that ends with a title in your name." />
      </Head>

      <Breadcrumb
        eyebrow={hero.eyebrow ?? "The Land Access Club"}
        title={
          <>
            {hero.title ?? "Save monthly."}{" "}
            <span className="italic text-gradient-gold">{hero.titleAccent ?? "Own land for life."}</span>
          </>
        }
        description={
          hero.description ??
          "A fintech-grade savings program that ends with a legally registered land title in your name — no lotteries, no shortcuts, no surprises."
        }
        buttons={[
          { label: hero.ctaPrimaryLabel ?? "Start my membership", href: "/register", icon: <ArrowRight className="h-4 w-4" /> },
          { label: hero.ctaSecondaryLabel ?? "Browse eligible properties", href: "/properties", variant: "outline" },
        ]}
      />

      <section className="py-24">
        <div className="container-x">
          <SectionHeader align="center" eyebrow={content.benefits?.eyebrow ?? "Why join"} title={content.benefits?.title ?? "Benefits designed like a private bank."} />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => {
              const Icon = resolveIcon(b.icon);
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-3xl bg-card border border-border p-7 hover:shadow-elegant hover:-translate-y-1 transition-all"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-blue text-white shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/40">
        <div className="container-x">
          <SectionHeader align="center" eyebrow={content.journey?.eyebrow ?? "Membership journey"} title={content.journey?.title ?? "Your path from savings to signed title."} />
          <div className="mt-16 max-w-4xl mx-auto space-y-4">
            {journey.map((j, i) => (
              <motion.div
                key={j.month}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-6 items-start rounded-3xl bg-card border border-border p-6"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-primary">{j.month}</div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{j.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{j.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x max-w-4xl">
          <SectionHeader align="center" eyebrow={content.eligibility?.eyebrow ?? "Eligibility"} title={content.eligibility?.title ?? "Simple, transparent requirements."} />
          <div className="mt-12 rounded-3xl bg-card border border-border p-8 md:p-12">
            <ul className="grid gap-4 sm:grid-cols-2">
              {requirements.map((r) => (
                <li key={r.text} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-gradient-gold text-navy shrink-0">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm">{r.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Plans />

      {testimonials.length > 0 && (
        <section className="py-24">
          <div className="container-x">
            <SectionHeader align="center" eyebrow="Success stories" title="From savers to landowners." />
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-3xl bg-card border border-border p-8 hover:shadow-elegant transition"
                >
                  <Rocket className="h-6 w-6 text-primary" />
                  <blockquote className="mt-5 font-display text-xl leading-snug">"{t.quote}"</blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-blue text-white font-semibold shrink-0">
                      {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQ items={faqs} />
    </>
  );
}