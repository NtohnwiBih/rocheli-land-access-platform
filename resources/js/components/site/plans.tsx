import { Check } from "lucide-react";
import { motion } from "motion/react";
import { plans } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section";

export function Plans() {
  return (
    <section className="py-24 bg-muted/40">
      <div className="container-x">
        <SectionHeader
          align="center"
          eyebrow="Plans"
          title="Property Plans & Contributions"
          description="Choose the plan that matches your rhythm. Move between plans anytime as your income grows."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
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
                  Popular
                </div>
              )}
              {/* Header */}
              <div className="relative bg-gradient-blue p-7 text-white">
                <div className="text-sm font-semibold">{p.name} Plan</div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-bold text-gold">{p.total}</span>
                  <span className="text-sm font-medium text-white/80">{p.currency}</span>
                </div>
              </div>
              {/* Contribution rows */}
              <div className="p-6 flex-1">
                <div className="space-y-0">
                  {[
                    { label: "Daily", value: p.daily },
                    { label: "Weekly", value: p.weekly },
                    { label: "Monthly", value: p.monthly },
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
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" strokeWidth={3} />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-full border-border bg-muted hover:bg-muted/80 text-foreground font-semibold"
                >
                  <Check className="h-4 w-4 mr-2" strokeWidth={3} />
                  Choose plan
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
