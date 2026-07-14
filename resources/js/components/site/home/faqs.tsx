import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { SectionHeader } from "../section";

const faqs = [
  {
    q: "How do I join the Land Access Club?",
    a: "You choose a contribution plan that fits your income, complete membership verification in under 24 hours, and start contributing monthly. Every step lives on your personal Rocheli dashboard.",
  },
  {
    q: "Are the properties legally verified?",
    a: "Yes. Every property passes a rigorous internal audit by our legal desk before publication. Titles are registered with the Land Conservation authority and shared digitally with each buyer.",
  },
  {
    q: "What happens if I miss a monthly contribution?",
    a: "We build in a grace period and offer restructuring. Members can pause, downshift plans, or catch up later — your allocation credit is protected.",
  },
  {
    q: "Can I resell my property later?",
    a: "Absolutely. Rocheli operates a members-only resale marketplace with priority access for existing Club members. Prime tier includes an optional guaranteed buy-back.",
  },
  {
    q: "Do you finance construction?",
    a: "We partner with regional banks and micro-finance institutions on construction credit, and offer optional Rocheli-managed development for a fee.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24 bg-muted/40">
      <div className="container-x max-w-4xl">
        <SectionHeader
          align="center"
          eyebrow="Questions"
          title="Everything you were wondering."
        />
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-6 shadow-card-soft data-[state=open]:shadow-elegant transition"
            >
              <AccordionTrigger className="py-5 text-left font-display text-lg hover:no-underline [&[data-state=open]>svg]:rotate-45">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}