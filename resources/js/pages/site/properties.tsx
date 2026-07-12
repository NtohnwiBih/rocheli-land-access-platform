import { Head } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { properties } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/site/breadcrumbs";
import { PropertyFilters, cities } from "@/components/site/properties/filters";
import { PropertyListing } from "@/components/site/properties/listing";

export default function Properties() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All cities");
  const [type, setType] = useState("All types");
  const [payment, setPayment] = useState("Any payment");
  const [status, setStatus] = useState("Any status");
  const [priceMax, setPriceMax] = useState(30000000);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (q && !`${p.title} ${p.location}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (city !== "All cities" && !p.location.includes(city)) return false;
      if (type !== "All types" && p.type !== type) return false;
      if (payment === "Installments" && !p.installment) return false;
      if (status !== "Any status" && p.status !== status) return false;
      if (p.priceValue > priceMax) return false;
      return true;
    });
  }, [q, city, type, payment, status, priceMax]);

  const filterState = {
    city,
    setCity,
    type,
    setType,
    payment,
    setPayment,
    status,
    setStatus,
    priceMax,
    setPriceMax,
  };

  // Filtering already happens live as `q`/`city` change, so the search
  // button doesn't need to do anything extra — this just exists so the
  // button has a handler and can later be extended without touching
  // Breadcrumb itself.
  const handleSearch = () => {};

  const resetFilters = () => {
    setCity("All cities");
    setType("All types");
    setPayment("Any payment");
    setStatus("Any status");
    setPriceMax(30000000);
  };

  return (
    <>
      <Head title="Properties — Rocheli Real Properties">
        <meta
          name="description"
          content="Explore Rocheli's verified land plots and property developments across Cameroon — Douala, Yaoundé, Kribi, Buea and more."
        />
        <meta property="og:title" content="Properties — Rocheli Real Properties" />
        <meta
          property="og:description"
          content="Verified plots and estates across Cameroon's growth corridors."
        />
      </Head>

      <Breadcrumb
        eyebrow="Marketplace"
        title={
          <>
            Verified properties across{" "}
            <span className="italic text-gradient-gold">Cameroon.</span>
          </>
        }
        description="Every listing is title-audited, geo-mapped, and eligible for structured installments through the Land Access Club."
        search={{
          value: q,
          onChange: setQ,
          placeholder: "Search by city, project or feature…",
          city,
          onCityChange: setCity,
          cities,
          onSubmit: handleSearch,
        }}
      />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Reset
                </button>
              </div>
              <PropertyFilters {...filterState} />
            </div>
          </aside>
          
           <PropertyListing filtered={filtered} total={properties.length} filters={filterState} />
        </div>
      </section>
    </>
  );
}