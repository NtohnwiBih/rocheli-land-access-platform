import { motion } from "motion/react";
import { SectionHeader } from "../section";

export default function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Join the Club",
      body: "Choose a contribution plan aligned with your goals — Starter, Growth, Advance or Prime.",
    },
    {
      n: "02",
      title: "Contribute Monthly",
      body: "Automated contributions build your allocation credit. Track everything from your dashboard.",
    },
    {
      n: "03",
      title: "Reserve Property",
      body: "Once eligible, reserve your plot from vetted inventory across our cities.",
    },
    {
      n: "04",
      title: "Own Your Land",
      body: "Sign your registered title, receive your deed, and step into ownership.",
    },
  ];
  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHeader
          align="center"
          eyebrow="How it works"
          title={
            <>
              Four steps between you and{" "}
              <span className="italic text-gradient-blue">your land title.</span>
            </>
          }
        />
        <div className="mt-16 relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative rounded-3xl bg-card border border-border p-7 hover:shadow-elegant transition-all"
            >
              <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-blue text-white font-display text-xl font-bold shadow-glow">
                {s.n}
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
