import { motion } from "motion/react";
import { Link } from "@inertiajs/react";
import { SectionHeader } from "../section";
import { ArrowRight } from "lucide-react";

type ArticleItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string | null;
  readTime: string | null;
  image: string | null;
  date: string | null;
};

type Props = {
  content?: { eyebrow?: string; title?: string };
  items: ArticleItem[];
};

export default function Articles({ content = {}, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeader eyebrow={content.eyebrow ?? "Latest insights"} title={content.title ?? "Notes from the Rocheli desk"} />
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80">
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((a, i) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-3xl overflow-hidden bg-card border border-border hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                {a.image && (
                  <img src={a.image} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold">{a.category}</span>
                  {a.readTime && <span className="text-muted-foreground">{a.readTime}</span>}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold leading-snug group-hover:text-primary transition">{a.title}</h3>
                <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{a.author}</span>
                  <span>{a.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}