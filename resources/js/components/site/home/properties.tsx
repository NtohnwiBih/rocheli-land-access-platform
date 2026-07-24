import { ArrowRight } from "lucide-react";
import { SectionHeader } from "../section";
import { Link } from "@inertiajs/react";
import { PropertyCard } from "../components/property-card";
import { Property } from "@/types";
import { useState } from "react";

type Props = {
  items: Property[];
}

export default function Featured({ items }: Props) {
  const [i, setI] = useState(0);

  if (items.length === 0) return null;
  const t = items[i] ?? items[0];
  return (
    <section className="py-24 bg-muted/40">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeader
            eyebrow="Featured properties"
            title={
              <>
                Verified plots and estates in{" "}
                <span className="italic text-gradient-blue">Cameroon's growth corridors</span>
              </>
            }
            description="From beachfront enclaves in Kribi to hillside residences in Buea — every listing is title-verified and installment-ready."
          />
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold shadow-card-soft hover:border-primary hover:text-primary transition"
          >
            View all properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((p, i) => (
            <PropertyCard key={p.id} p={p as any} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}