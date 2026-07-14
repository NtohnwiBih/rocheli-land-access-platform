import { motion } from "motion/react";
import { FileText, HeartHandshake, KeyRound, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { SectionHeader } from "../section";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Properties",
    body: "Every plot is title-audited, geo-mapped, and legally cleared before it reaches our members.",
  },
  {
    icon: Wallet,
    title: "Flexible Payment Plans",
    body: "Structured monthly contributions built around your income, not the market.",
  },
  {
    icon: FileText,
    title: "Secure Documentation",
    body: "Digital land titles, registered deeds, and lifetime access to your ownership records.",
  },
  {
    icon: HeartHandshake,
    title: "Professional Support",
    body: "A dedicated relationship manager guides you from contribution to allocation.",
  },
  {
    icon: TrendingUp,
    title: "Investment Growth",
    body: "Our properties historically appreciate 12–25% annually across active corridors.",
  },
  {
    icon: KeyRound,
    title: "Property Management",
    body: "Optional development, rental, and resale support — powered by our operations team.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHeader
          align="center"
          eyebrow="Why Rocheli"
          title={
            <>
              Built like a bank.{" "}
              <span className="italic text-gradient-blue">Trusted like family.</span>
            </>
          }
          description="We combine fintech-grade rigor with real-estate craftsmanship to make ownership secure, transparent, and inevitable."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
            >
              <div
                className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl"
                style={{ background: "var(--gradient-gold)" }}
              />
              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-blue text-white shadow-glow">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}