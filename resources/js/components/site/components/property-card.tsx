import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { MapPin, Maximize2, ArrowUpRight, Wallet } from "lucide-react";
import type { Property } from "@/lib/mock-data";

const statusStyle: Record<Property["status"], string> = {
  Available: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Fast Selling": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "New Launch": "bg-gradient-gold text-navy border-transparent",
  "Sold Out": "bg-muted text-muted-foreground border-border",
};

export function PropertyCard({ p, index = 0 }: { p: Property; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl bg-card shadow-card-soft hover:shadow-elegant transition-all duration-500"
    >
      <Link href={`/properties/${p.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusStyle[p.status]}`}
            >
              {p.status}
            </span>
            {p.installment && (
              <span className="rounded-full border border-white/25 bg-white/15 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white flex items-center gap-1">
                <Wallet className="h-3 w-3" /> Installments
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5" /> {p.location}
            </div>
            <h3 className="font-display text-xl font-semibold mt-1">{p.title}</h3>
          </div>
        </div>

        <div className="p-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Starting from
            </div>
            <div className="font-display text-2xl font-bold text-gradient-blue">
              {p.price}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Maximize2 className="h-4 w-4" />
            {p.size}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
