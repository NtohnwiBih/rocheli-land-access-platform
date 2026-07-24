import { Head, useForm, usePage } from "@inertiajs/react";
import { ArrowRight, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type PropertyDetail = {
  id: number;
  title: string;
  description: string | null;
  location: string;
  size: string;
  type: string;
  price: string;
  status: string;
  image_url: string | null;
  media: { id: number; src: string; caption: string | null; is_featured: boolean }[];
  category: string | null;
  city: string | null;
};

type PageProps = {
  auth: { user: { name: string; email: string } | null };
  [key: string]: unknown;
};

const INTERESTS = [
  { value: "buy", label: "I want to buy this" },
  { value: "financing", label: "Ask about financing / installments" },
  { value: "visit", label: "Schedule a site visit" },
  { value: "information", label: "Just more information" },
];

export default function PropertyShow({ property }: { property: PropertyDetail }) {
  const { props } = usePage<PageProps>();
  const user = props.auth?.user ?? null;

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
      <Head title={`${property.title} — Rocheli Real Properties`} />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-muted">
              {property.image_url && (
                <img src={property.image_url} alt={property.title} className="h-full w-full object-cover" />
              )}
            </div>
            <h1 className="mt-6 font-display text-3xl font-semibold">{property.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {property.location}
            </div>
            {property.description && <p className="mt-6 text-muted-foreground">{property.description}</p>}
          </div>

          <form onSubmit={submit} className="rounded-3xl bg-card border border-border p-6 md:p-8 space-y-4 h-fit sticky top-28">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Price</div>
              <div className="mt-1 font-display text-2xl font-semibold">{property.price}</div>
            </div>

            {/* Guest-only fields — hidden entirely for logged-in members,
                since their contact info is already on file via member_id. */}
            {!user && (
              <>
                <div>
                  <input
                    placeholder="Full name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      placeholder="Email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      className="w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <input
                      placeholder="Phone / WhatsApp"
                      value={data.phone}
                      onChange={(e) => setData("phone", e.target.value)}
                      className="w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                </div>
              </>
            )}

            {user && (
              <p className="text-sm text-muted-foreground">
                Enquiring as <span className="font-semibold text-foreground">{user.name}</span> ({user.email})
              </p>
            )}

            <select
              value={data.interest}
              onChange={(e) => setData("interest", e.target.value)}
              className="w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="">I'm interested in…</option>
              {INTERESTS.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>

            <textarea
              rows={4}
              placeholder="Anything specific you'd like to know?"
              value={data.message}
              onChange={(e) => setData("message", e.target.value)}
              className="w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />

            <Button type="submit" disabled={processing} className="w-full bg-gradient-blue text-white h-12 rounded-xl font-semibold">
              {processing ? "Sending…" : "Send enquiry"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}