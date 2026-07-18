import { Breadcrumb } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/site/section";
import { resolveIcon } from "@/lib/icon-map";

type ServiceItem = {
  icon: string;
  title: string;
  body: string;
  points: { text: string }[];
};

type Props = {
  content: {
    hero?: { eyebrow?: string; title?: string; titleAccent?: string; description?: string };
    list?: { items?: ServiceItem[] };
    cta?: { title?: string; titleAccent?: string; ctaPrimaryLabel?: string; ctaSecondaryLabel?: string };
  };
};

const fallbackServices: ServiceItem[] = [
  { icon: "Landmark", title: "Land Sales", body: "Curated inventory of title-verified plots in Cameroon's fastest-growing corridors, ready for outright or structured purchase.", points: [{ text: "Title-audited plots" }, { text: "Installment options" }, { text: "Legal handover" }] },
  { icon: "Building2", title: "Property Management", body: "Turnkey management of your land or built asset — from perimeter security and maintenance to leasing and reporting.", points: [{ text: "Security & upkeep" }, { text: "Tenant handling" }, { text: "Monthly reports" }] },
  { icon: "BadgeCheck", title: "Title Verification", body: "Independent legal audit of any land title, deed or purchase agreement. Know exactly what you're signing.", points: [{ text: "Land Conservation checks" }, { text: "Boundary survey" }, { text: "Encumbrance report" }] },
  { icon: "LineChart", title: "Investment Advisory", body: "Strategic guidance for individuals, family offices and institutions deploying capital into Cameroonian real estate.", points: [{ text: "Portfolio design" }, { text: "Deal sourcing" }, { text: "Exit planning" }] },
  { icon: "Briefcase", title: "Asset Management", body: "Long-term stewardship of real-estate portfolios with reporting, tax structuring and value-optimisation.", points: [{ text: "Reporting suite" }, { text: "Tax optimisation" }, { text: "Value engineering" }] },
  { icon: "ShieldCheck", title: "Real Estate Consulting", body: "Bespoke consulting for developers, corporates and public institutions on land, housing and infrastructure projects.", points: [{ text: "Feasibility studies" }, { text: "Master planning" }, { text: "Public-private partnerships" }] },
];

export default function Services({ content = {} }: Props) {
  const hero = content.hero ?? {};
  const services = content.list?.items?.length ? content.list.items : fallbackServices;
  const cta = content.cta ?? {};

  return (
    <>
      <Head title="Services — Rocheli Real Properties">
        <meta
          name="description"
          content="Land sales, property management, title verification, investment advisory and asset management — a full real-estate stack in one place."
        />
        <meta property="og:title" content="Services — Rocheli Real Properties" />
        <meta property="og:description" content="A full real-estate stack: sales, management, advisory and more." />
      </Head>

      <Breadcrumb
        eyebrow={hero.eyebrow ?? "Services"}
        title={
          <>
            {hero.title ?? "A full real-estate stack,"}{" "}
            <span className="italic text-gradient-gold">{hero.titleAccent ?? "under one roof."}</span>
          </>
        }
        description={
          hero.description ??
          "From your first plot to a multi-asset portfolio — Rocheli's teams handle the sales, legal, management and advisory work end-to-end."
        }
      />

      <section className="py-24">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = resolveIcon(s.icon);
              return (
                <motion.article
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
                >
                  <div
                    className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
                    style={{ background: "var(--gradient-blue)" }}
                  />
                  <div className="relative">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-gold text-navy">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
                    <ul className="mt-6 space-y-1.5 text-sm text-muted-foreground">
                      {s.points.map((p) => (
                        <li key={p.text} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {p.text}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      Enquire <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-blue text-white p-10 md:p-14 grain">
            <SectionHeader
              align="center"
              title={
                <span className="text-white">
                  {cta.title ?? "Not sure which service fits?"}{" "}
                  <span className="italic text-gradient-gold">{cta.titleAccent ?? "Talk to us."}</span>
                </span>
              }
            />
            <div className="mt-8 flex justify-center flex-wrap gap-3">
              <Button asChild className="bg-gradient-gold text-navy rounded-full h-13 h-14 px-7 font-semibold hover:opacity-95">
                <Link href="/contact">{cta.ctaPrimaryLabel ?? "Book a consultation"}</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full h-14 px-6 border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/properties">{cta.ctaSecondaryLabel ?? "See live inventory"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}