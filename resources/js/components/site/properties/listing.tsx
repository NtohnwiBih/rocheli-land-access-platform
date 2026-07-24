import { SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PropertyFilters, PropertyFiltersState } from "./filters";
import { PropertyCard } from "../components/property-card";
import { Property } from "@/types";

interface PropertyListingProps {
  filtered: Property[];
  total: number;
  filters: PropertyFiltersState;
}

export function PropertyListing({ filtered, total, filters }: PropertyListingProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          {t("properties.listing.showing", "Showing")}{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          {t("properties.listing.of", "of")} {total} {t("properties.listing.properties", "properties")}
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden rounded-full h-10">
                <SlidersHorizontal className="h-4 w-4" /> {t("properties.filters.title", "Filters")}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>{t("properties.filters.title", "Filters")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto pb-10">
                <PropertyFilters {...filters} />
              </div>
            </SheetContent>
          </Sheet>
          <select className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
            <option>{t("properties.listing.sortFeatured", "Sort: Featured")}</option>
            <option>{t("properties.listing.sortPriceLowHigh", "Price: Low → High")}</option>
            <option>{t("properties.listing.sortPriceHighLow", "Price: High → Low")}</option>
            <option>{t("properties.listing.sortNewest", "Newest")}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-muted">
            <X className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold">
            {t("properties.listing.emptyTitle", "No properties match those filters")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("properties.listing.emptyBody", "Try widening your search or resetting filters.")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} p={p as any} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}