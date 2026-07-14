import { stats } from "@/lib/mock-data";
import { motion } from "motion/react";
import { Counter } from "../section";

export default function Stats() {
  return (
    <section className="py-20 bg-background">
      <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-3xl bg-card border border-border p-7 shadow-card-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
          >
            <div className="font-display text-5xl font-bold text-gradient-blue">
              <Counter
                value={s.value}
                prefix={s.prefix ?? ""}
                suffix={s.suffix}
                decimals={s.value < 10 ? 1 : 0}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}