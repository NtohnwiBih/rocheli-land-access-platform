import { Head } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/site/breadcrumbs";
import { PropertyFilters, cities } from "@/components/site/properties/filters";
import { PropertyListing } from "@/components/site/properties/listing";
import type { Property } from "@/types";

interface Props {
  properties: Property[];
}

export default function Properties({ properties }: Props) {
  const { t } = useTranslation();

  const [q, setQ] = useState("");
  const [city, setCity] = useState("All cities");
  const [type, setType] = useState("All types");
  const [payment, setPayment] = useState("Any payment");
  const [status, setStatus] = useState("Any status");
  const [priceMax, setPriceMax] = useState(30000000);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const haystack = `${p.title} ${p.location} ${p.city ?? ""}`.toLowerCase();
      if (q && !haystack.includes(q.toLowerCase())) return false;
      if (city !== "All cities" && p.city !== city) return false;
      if (type !== "All types" && p.type !== type) return false;
      if (status !== "Any status" && p.status !== status) return false;
      if (p.priceValue > priceMax) return false;
      return true;
    });
  }, [q, city, type, status, priceMax]);

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
      <Head title={t("properties.meta.title", "Properties - Rocheli Real Properties")}>
        <meta
          name="description"
          content={t(
            "properties.meta.description",
            "Explore Rocheli's verified land plots and property developments across Cameroon - Douala, Yaounde, Kribi, Buea and more."
          )}
        />
        <meta property="og:title" content={t("properties.meta.ogTitle", "Properties - Rocheli Real Properties")} />
        <meta
          property="og:description"
          content={t("properties.meta.ogDescription", "Verified plots and estates across Cameroon's growth corridors.")}
        />
      </Head>

      <Breadcrumb
        eyebrow={t("properties.hero.eyebrow", "Marketplace")}
        title={
          <>
            {t("properties.hero.title", "Verified properties across")}{" "}
            <span className="italic text-gradient-gold">{t("properties.hero.titleAccent", "Cameroon.")}</span>
          </>
        }
        description={t(
          "properties.hero.description",
          "Every listing is title-audited, geo-mapped, and eligible for structured installments through the Land Access Club."
        )}
        search={{
          value: q,
          onChange: setQ,
          placeholder: t("properties.hero.searchPlaceholder", "Search by city, project or feature…"),
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
                <h2 className="font-display text-xl font-semibold">{t("properties.filters.title", "Filters")}</h2>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {t("properties.filters.reset", "Reset")}
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