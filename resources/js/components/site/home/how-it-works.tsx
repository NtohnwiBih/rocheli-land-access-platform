import { motion } from "motion/react";
import { SectionHeader } from "../section";

type Step = { number: string; title: string; description: string };

type Props = {
  content?: {
    eyebrow?: string;
    title?: string;
    titleAccent?: string;
    steps?: Step[];
  };
};

const fallbackSteps: Step[] = [
  { number: "01", title: "Join the Club", description: "Choose a contribution plan aligned with your goals — Starter, Growth, Advance or Prime." },
  { number: "02", title: "Contribute Monthly", description: "Automated contributions build your allocation credit. Track everything from your dashboard." },
  { number: "03", title: "Reserve Property", description: "Once eligible, reserve your plot from vetted inventory across our cities." },
  { number: "04", title: "Own Your Land", description: "Sign your registered title, receive your deed, and step into ownership." },
];

export default function HowItWorks({ content = {} }: Props) {
  const steps = content.steps?.length ? content.steps : fallbackSteps;

  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHeader
          align="center"
          eyebrow={content.eyebrow ?? "How it works"}
          title={
            <>
              {content.title ?? "Four steps between you and"}{" "}
              <span className="italic text-gradient-blue">{content.titleAccent ?? "your land title."}</span>
            </>
          }
        />
        <div className="mt-16 relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative rounded-3xl bg-card border border-border p-7 hover:shadow-elegant transition-all"
            >
              <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-blue text-white font-display text-xl font-bold shadow-glow">
                {s.number}
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}