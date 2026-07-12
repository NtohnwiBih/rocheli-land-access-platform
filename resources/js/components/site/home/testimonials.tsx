import { motion } from "motion/react";
import { testimonials } from "@/lib/mock-data";
import { useState } from "react";
import { SectionHeader } from "../section";
import { Star } from "lucide-react";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  return (
    <section className="py-24 bg-muted/40">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.2fr] items-center">
        <div>
          <SectionHeader
            eyebrow="Member stories"
            title={
              <>
                Real people.{" "}
                <span className="italic text-gradient-blue">Real ownership.</span>
              </>
            }
            description="Every quarter, hundreds of new members join the Club. Here are a few of their stories."
          />
          <div className="mt-8 flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-10 bg-gradient-blue" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[2rem] bg-card border border-border p-8 md:p-12 shadow-card-soft"
        >
          <div className="flex gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <blockquote className="mt-5 font-display text-2xl md:text-3xl leading-[1.25] tracking-tight">
            "{t.quote}"
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-blue text-white font-display text-lg font-bold shrink-0">
              {t.initials}
            </div>
            <div className="min-w-0">
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-muted-foreground">
                {t.role} · {t.property}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}