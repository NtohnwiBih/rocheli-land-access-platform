import { Breadcrumb } from "@/components/site/breadcrumbs";
import { SectionHeader } from "@/components/site/section";
import { articles } from "@/lib/mock-data";
import { Head } from "@inertiajs/react";
import { ArrowRight, BookOpen, Download, FileQuestion, Video } from "lucide-react";
import { motion } from "motion/react";

const categories = ["All", "Guides", "Investment", "Legal", "Videos", "Downloads"];


export default function Resources() {

    const featured = [
        { title: "The complete guide to buying land in Cameroon", type: "Guide", image: "/property-1.jpg", size: "large" },
        { title: "How to read a land title in 4 minutes", type: "Video", image: "/property-2.jpg" },
        { title: "2025 property market outlook", type: "Report", image: "/property-4.jpg" },
        { title: "Rocheli Membership Handbook", type: "Download", image: "/property-1.jpg" },
        { title: "Douala neighborhoods: an investor's map", type: "Guide", image: "/property-2.jpg" },
    ];

    return (
        <>
          <Head title="Resources — Rocheli Real Properties">
            <meta
            name="description"
            content="Guides, articles, videos and downloads to help you buy, own and grow land in Cameroon."
            />
            <meta property="og:title" content="Resources — Rocheli Real Properties" />
            <meta
            property="og:description"
            content="Everything you need to buy and own land in Cameroon with confidence."
            />
          </Head>

          <Breadcrumb
            eyebrow="Knowledge hub"
            title={
                <>
                Everything you need to{" "}
                <span className="italic text-gradient-gold">buy, own, grow.</span>
                </>
            }
            description="Guides, videos, market reports and downloads written by Rocheli's real
            estate, legal and finance teams."
          />


          <section className="py-16 border-b border-border">
            <div className="container-x flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((c, i) => (
                <button
                key={c}
                className={`rounded-full border px-5 py-2 text-sm font-semibold shrink-0 transition ${
                    i === 0
                    ? "bg-gradient-blue text-white border-transparent shadow-glow"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
                >
                {c}
                </button>
            ))}
            </div>
          </section>

          <section className="py-16">
            <div className="container-x">
                <SectionHeader eyebrow="Featured" title="Editor's picks this month" />
                <div className="mt-12 grid gap-6 md:grid-cols-6 auto-rows-[240px]">
                    {featured.map((f, i) => {
                    const span =
                        i === 0
                        ? "md:col-span-4 md:row-span-2"
                        : i === 1
                        ? "md:col-span-2"
                        : i === 2
                        ? "md:col-span-2"
                        : "md:col-span-3";
                    return (
                        <motion.article
                        key={f.title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        className={`relative group overflow-hidden rounded-3xl ${span}`}
                        >
                        <img
                            src={f.image}
                            alt={f.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                            <span className="self-start rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                            {f.type}
                            </span>
                            <h3 className={`mt-3 font-display font-semibold leading-tight ${i === 0 ? "text-3xl md:text-4xl" : "text-lg"}`}>
                            {f.title}
                            </h3>
                            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                            Read <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                        </div>
                        </motion.article>
                    );
                    })}
                </div>
            </div>
          </section>

           <section className="py-16 bg-muted/40">
        <div className="container-x">
          <SectionHeader eyebrow="Latest articles" title="From the Rocheli desk" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[...articles, ...articles].map((a, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="group rounded-3xl overflow-hidden bg-card border border-border hover:shadow-elegant transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {a.category}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
                    {a.title}
                  </h3>
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>{a.author}</span>
                    <span>{a.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x grid gap-6 md:grid-cols-4">
          {[
            { icon: BookOpen, label: "Guides", count: 42 },
            { icon: Video, label: "Video library", count: 18 },
            { icon: Download, label: "Downloads", count: 24 },
            { icon: FileQuestion, label: "Member FAQ", count: 60 },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl bg-card border border-border p-7 hover:shadow-elegant hover:-translate-y-1 transition"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-blue text-white shadow-glow">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-3xl font-bold">{c.count}</div>
              <div className="text-sm text-muted-foreground">{c.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
        </>
    )
}