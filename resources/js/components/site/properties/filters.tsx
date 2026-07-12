export const cities = ["All cities", "Douala", "Yaoundé", "Kribi", "Buea", "Bafoussam", "Limbe"];
export const types = ["All types", "Residential", "Beachfront", "Commercial", "Mixed-Use"];
export const paymentOptions = ["Any payment", "Installments", "Outright"];
export const availability = ["Any status", "Available", "Fast Selling", "New Launch"];

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
}: PropertyFiltersState) {
  return (
    <div className="space-y-6">
      <FilterGroup label="Location" options={cities} value={city} onChange={setCity} />
      <FilterGroup label="Property type" options={types} value={type} onChange={setType} />
      <FilterGroup label="Payment" options={paymentOptions} value={payment} onChange={setPayment} />
      <FilterGroup label="Availability" options={availability} value={status} onChange={setStatus} />
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Max price
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
            Up to FCFA {(priceMax / 1_000_000).toFixed(1)}M
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
  options: string[];
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
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              value === o
                ? "bg-gradient-blue text-white border-transparent shadow-glow"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}