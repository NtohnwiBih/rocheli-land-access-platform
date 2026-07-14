import { ArrowRight } from "lucide-react";
import { SectionHeader } from "../section";
import { Link } from "@inertiajs/react";
import { PropertyCard } from "../components/property-card";
import { properties } from "@/lib/mock-data";

export default function Featured() {
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
          {properties.slice(0, 6).map((p, i) => (
            <PropertyCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}