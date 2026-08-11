import { useTranslation } from "react-i18next";

export const paymentOptions = ["Any payment", "Installments", "Outright"];
export const availability = ["Any status", "Available", "Selling Fast", "Reserved", "Sold"];

export const VALUE_KEYS: Record<string, string> = {
  "Any payment": "properties.filters.values.anyPayment",
  "Installments": "properties.filters.values.installments",
  "Outright": "properties.filters.values.outright",
  "Any status": "properties.filters.values.anyStatus",
  "Available": "properties.filters.values.available",
  "Selling Fast": "properties.filters.values.sellingFast",
  "Reserved": "properties.filters.values.reserved",
  "Sold": "properties.filters.values.sold",
};

export interface FilterOption {
  value: string;
  label: string;
}

export interface PropertyFiltersState {
  city: string;
  setCity: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  payment: string;
  setPayment: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
}

interface PropertyFiltersProps extends PropertyFiltersState {
  cityOptions: FilterOption[];
  typeOptions: FilterOption[];
}

export function PropertyFilters({
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
  cityOptions,
  typeOptions,
}: PropertyFiltersProps) {
  const { t } = useTranslation();

  const paymentOpts: FilterOption[] = paymentOptions.map((o) => ({ value: o, label: t(VALUE_KEYS[o] ?? o, o) }));
  const statusOpts: FilterOption[] = availability.map((o) => ({ value: o, label: t(VALUE_KEYS[o] ?? o, o) }));

  return (
    <div className="space-y-6">
      <FilterGroup label={t("properties.filters.location", "Location")} options={cityOptions} value={city} onChange={setCity} />
      <FilterGroup label={t("properties.filters.propertyType", "Property type")} options={typeOptions} value={type} onChange={setType} />
      <FilterGroup label={t("properties.filters.payment", "Payment")} options={paymentOpts} value={payment} onChange={setPayment} />
      <FilterGroup label={t("properties.filters.availability", "Availability")} options={statusOpts} value={status} onChange={setStatus} />
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          {t("properties.filters.maxPrice", "Max price")}
        </div>
        <input
          type="range"
          min={5000000}
          max={30000000}
          step={500000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>FCFA 5M</span>
          <span className="font-semibold text-foreground">
            {t("properties.filters.upTo", "Up to FCFA {{amount}}M", { amount: (priceMax / 1_000_000).toFixed(1) })}
          </span>
          <span>FCFA 30M</span>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              value === o.value
                ? "bg-gradient-blue text-white border-transparent shadow-glow"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}