import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section";
import { useTranslation } from "react-i18next";
import { Link } from "@inertiajs/react";

type PlanItem = {
  id: number;
  name: string;
  slug: string;
  total: string;
  currency: string;
  daily: string;
  weekly: string;
  monthly: string;
  highlight: boolean;
};

interface PlansProps {
  items: PlanItem[];
}

export function Plans({ items }: PlansProps) {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-muted/40">
      <div className="container-x">
        <SectionHeader
          align="center"
          eyebrow={t('plans.eyebrow')}
          title={t('plans.titles')}
          description={t('plans.description')}
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-3xl overflow-hidden bg-card border flex flex-col ${
                p.highlight ? "border-gold shadow-elegant scale-[1.02]" : "border-border shadow-card-soft"
              }`}
            >
              {p.highlight && (
                <div className="absolute top-4 right-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-navy z-10">
                  {t('plans.popular')}
                </div>
              )}
              {/* Header */}
              <div className="relative bg-gradient-blue p-7 text-white">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-bold text-gold">{p.total}</span>
                  <span className="text-sm font-medium text-white/80">{p.currency}</span>
                </div>
              </div>
              {/* Contribution rows */}
              <div className="p-6 flex-1">
                <div className="space-y-0">
                  {[
                    { label: t('plans.daily'), value: p.daily },
                    { label: t('plans.weekly'), value: p.weekly },
                    { label: t('plans.monthly'), value: p.monthly },
                  ].map((row, idx) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between py-3 text-sm ${
                        idx < 2 ? "border-b border-border" : ""
                      }`}
                    >
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-semibold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 pt-0">
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-11 rounded-full border-border bg-muted hover:bg-muted/80 text-foreground font-semibold"
                >
                  <Link href={`/register`}>
                    <Check className="mr-2 h-4 w-4" strokeWidth={3} />
                    {t("plans.choosePlan")}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}