import { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Ruler,
  Building2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Several fields come from the backend as either a plain string or a
// translation map (e.g. { en: "Available", fr: "Disponible" }) depending on
// whether the model has localized attributes. This type + helper keep every
// render site safe without assuming which shape a given field will take.
type Localized = string | Partial<Record<string, string>> | null | undefined;

function localize(value: Localized, locale: string): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.en ?? value.fr ?? Object.values(value)[0] ?? "";
}

type PropertyDetail = {
  id: number;
  title: Localized;
  description: Localized;
  location: Localized;
  size: Localized;
  type: Localized;
  price: Localized;
  status: Localized;
  image_url: string | null;
  media: { id: number; src: string; caption: Localized; is_featured: boolean }[];
  category: Localized;
  city: Localized;
};

type PageProps = {
  auth: { user: { name: string; email: string } | null };
  locale?: string;
  [key: string]: unknown;
};

type RelatedProperty = {
  id: number;
  slug: string;
  title: Localized;
  location: Localized;
  price: Localized;
  size: Localized;
  status: Localized;
  type: Localized;
  image: string | null;
  category: Localized;
  city: Localized;
};

const INTERESTS = [
  { value: "buy", label: "I want to buy this" },
  { value: "financing", label: "Ask about financing / installments" },
  { value: "visit", label: "Schedule a site visit" },
  { value: "information", label: "Just more information" },
];

const STATUS_STYLES: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reserved: "bg-amber-50 text-amber-700 border-amber-200",
  sold: "bg-rose-50 text-rose-700 border-rose-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

function statusStyle(status: string) {
  return STATUS_STYLES[status.toLowerCase()] ?? "bg-muted text-muted-foreground border-border";
}

export default function PropertyShow({
  property,
  relatedProperties = [],
}: {
  property: PropertyDetail;
  relatedProperties?: RelatedProperty[];
}) {
  const { props } = usePage<PageProps>();
  const user = props.auth?.user ?? null;
  const locale = props.locale ?? "en";

  const title = localize(property.title, locale);
  const description = localize(property.description, locale);
  const location = localize(property.location, locale);
  const size = localize(property.size, locale);
  const type = localize(property.type, locale);
  const price = localize(property.price, locale);
  const status = localize(property.status, locale);
  const category = localize(property.category, locale);
  const city = localize(property.city, locale);

  // Build a gallery from media, falling back to the single image_url so
  // properties without a media set still render something.
  const gallery =
    property.media && property.media.length > 0
      ? [...property.media]
          .sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
          .map((item) => ({ ...item, caption: localize(item.caption, locale) }))
      : property.image_url
        ? [{ id: 0, src: property.image_url, caption: title, is_featured: true }]
        : [];

  const [activeImage, setActiveImage] = useState(0);

  const { data, setData, post, processing, errors, reset } = useForm({
    property_id: property.id,
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/enquiries", {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Enquiry sent — we'll be in touch shortly.");
        reset("name", "email", "phone", "interest", "message");
      },
      onError: () => toast.error("Please check the form and try again."),
    });
  };

  return (
    <>
      <Head title={`${title} — Rocheli Real Properties`} />

      <section className="py-12 md:py-16">
        <div className="container-x">
          {/* Breadcrumb */}
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All properties
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            {/* ---------------- Gallery + details ---------------- */}
            <div>
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-muted">
                {gallery.length > 0 ? (
                  <img
                    src={gallery[activeImage]?.src}
                    alt={gallery[activeImage]?.caption || title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    No photos available yet
                  </div>
                )}

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {status && (
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyle(status)}`}
                    >
                      {status}
                    </span>
                  )}
                  {category && (
                    <span className="rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
                      {category}
                    </span>
                  )}
                </div>

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={() => setActiveImage((i) => (i - 1 + gallery.length) % gallery.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={() => setActiveImage((i) => (i + 1) % gallery.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-label={`Show photo ${i + 1}`}
                      className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                        activeImage === i ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={item.src} alt={item.caption || ""} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <h1 className="mt-8 font-display text-3xl font-semibold">{title}</h1>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                {location}
                {city ? `, ${city}` : ""}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground" /> {size}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" /> {type}
                </span>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h2 className="font-display text-lg font-semibold">About this property</h2>
                {description ? (
                  <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
                ) : (
                  <p className="mt-3 italic text-muted-foreground">
                    Full details available on request — send an enquiry and our team will follow up.
                  </p>
                )}
              </div>
            </div>

            {/* ---------------- Sticky enquiry card ---------------- */}
            <div className="h-fit lg:sticky lg:top-28">
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Price
                </div>
                <div className="mt-1 font-display text-3xl font-semibold text-gradient-gold">
                  {price}
                </div>

                <form onSubmit={submit} className="mt-6 space-y-4 border-t border-border pt-6">
                  {!user && (
                    <>
                      <div>
                        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                          Full name
                        </label>
                        <input
                          id="name"
                          value={data.name}
                          onChange={(e) => setData("name", e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                            Phone / WhatsApp
                          </label>
                          <input
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                        </div>
                      </div>
                    </>
                  )}

                  {user && (
                    <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                      Enquiring as <span className="font-semibold text-foreground">{user.name}</span>{" "}
                      ({user.email})
                    </p>
                  )}

                  <div>
                    <label htmlFor="interest" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      I'm interested in
                    </label>
                    <select
                      id="interest"
                      value={data.interest}
                      onChange={(e) => setData("interest", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Choose an option…</option>
                      {INTERESTS.map((i) => (
                        <option key={i.value} value={i.value}>
                          {i.label}
                        </option>
                      ))}
                    </select>
                    {errors.interest && <p className="mt-1 text-xs text-rose-600">{errors.interest}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Message (optional)
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Anything specific you'd like to know?"
                      value={data.message}
                      onChange={(e) => setData("message", e.target.value)}
                      className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={processing}
                    className="h-12 w-full rounded-xl bg-gradient-blue font-semibold text-white"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send enquiry <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Prefer to talk directly?{" "}
                  <Link href="/contact" className="font-medium text-foreground underline underline-offset-2">
                    Contact our team
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {relatedProperties.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <h2 className="font-display text-2xl font-semibold">Related properties</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Other listings in the same area or category.
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProperties.map((item) => (
                  <RelatedPropertyCard key={item.id} property={item} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function RelatedPropertyCard({ property, locale }: { property: RelatedProperty; locale: string }) {
  const title = localize(property.title, locale);
  const location = localize(property.location, locale);
  const price = localize(property.price, locale);
  const status = localize(property.status, locale);

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {property.image ? (
          <img
            src={property.image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No photo
          </div>
        )}
        {status && (
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${statusStyle(status)}`}
          >
            {status}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-semibold leading-snug line-clamp-1">{title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="line-clamp-1">{location}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-sm font-semibold">{price}</span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}