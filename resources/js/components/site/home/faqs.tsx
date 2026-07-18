import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { SectionHeader } from "../section";

type FaqItem = { id: number; question: string; answer: string };

type Props = {
  content?: { eyebrow?: string; title?: string };
  items: FaqItem[];
};

export default function FAQ({ content = {}, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-muted/40">
      <div className="container-x max-w-4xl">
        <SectionHeader align="center" eyebrow={content.eyebrow ?? "Questions"} title={content.title ?? "Everything you were wondering."} />
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {items.map((f) => (
            <AccordionItem
              key={f.id}
              value={`item-${f.id}`}
              className="rounded-2xl border border-border bg-card px-6 shadow-card-soft data-[state=open]:shadow-elegant transition"
            >
              <AccordionTrigger className="py-5 text-left font-display text-lg hover:no-underline [&[data-state=open]>svg]:rotate-45">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}