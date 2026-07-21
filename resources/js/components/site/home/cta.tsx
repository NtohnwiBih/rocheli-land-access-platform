import { useForm } from "@inertiajs/react";
import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Eyebrow } from "../section";
import { Button } from "@/components/ui/button";

type Props = {
  content?: {
    eyebrow?: string;
    title?: string;
    titleAccent?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    ctaLabel?: string;
  };
};

const INTERESTS = [
  { value: "membership", label: "Land Access Club membership" },
  { value: "property", label: "Buying a specific property" },
  { value: "advisory", label: "Investment advisory" },
];

export default function ContactCTA({ content = {} }: Props) {
  const phone = content.phone ?? "+237 6 55 00 00 00";
  const whatsapp = content.whatsapp ?? phone;
  const address = content.address;

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/contact", {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Thanks — we'll be in touch within one business day.");
        reset();
      },
      onError: () => toast.error("Something went wrong. Please check the form and try again."),
    });
  };

  return (
    <section className="py-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-navy text-white p-10 md:p-16 grain">
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              background:
                "radial-gradient(40% 60% at 90% 10%, rgba(255,210,26,0.25), transparent 60%), radial-gradient(40% 60% at 10% 90%, rgba(18,152,194,0.3), transparent 60%)",
            }}
          />
          <div className="relative grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Eyebrow className="border-white/20 bg-white/5 text-white">
                {content.eyebrow ?? "Ready when you are"}
              </Eyebrow>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white">
                {content.title ?? "Talk to an advisor."}{" "}
                <span className="italic text-gradient-gold">
                  {content.titleAccent ?? "Own your first plot."}
                </span>
              </h2>
              <p className="mt-4 text-white/70 max-w-lg">
                Book a 30-minute consultation. We'll walk you through eligibility, available inventory and the best plan for your goals.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { icon: MapPin, t: address },
                  { icon: Phone, t: phone },
                  { icon: MessageCircle, t: `WhatsApp: ${whatsapp}` },
                ]
                  .filter((r) => r.t)
                  .map((r) => (
                    <div key={r.t} className="flex items-center gap-3 text-white/80">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 border border-white/15">
                        <r.icon className="h-4 w-4 text-gold" />
                      </span>
                      <span className="text-sm">{r.t}</span>
                    </div>
                  ))}
              </div>
            </div>

            <form onSubmit={submit} className="glass rounded-3xl p-6 md:p-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <input
                    placeholder="Full name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold"
                  />
                  {errors.name && <p className="mt-1 text-xs text-rocheli-gold">{errors.name}</p>}
                </div>
                <div className="min-w-0">
                  <input
                    placeholder="Phone / WhatsApp"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-rocheli-gold">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <input
                  placeholder="Email address"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold"
                />
                {errors.email && <p className="mt-1 text-xs text-rocheli-gold">{errors.email}</p>}
              </div>

              <select
                value={data.interest}
                onChange={(e) => setData("interest", e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white outline-none focus:border-gold"
              >
                <option value="" className="text-navy">I'm interested in…</option>
                {INTERESTS.map((i) => (
                  <option key={i.value} value={i.value} className="text-navy">{i.label}</option>
                ))}
              </select>

              <div>
                <textarea
                  rows={4}
                  placeholder="Tell us about your goals…"
                  value={data.message}
                  onChange={(e) => setData("message", e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold resize-none"
                />
                {errors.message && <p className="mt-1 text-xs text-rocheli-gold">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-gold text-navy hover:opacity-95 h-12 rounded-xl font-semibold"
              >
                {processing ? "Sending…" : content.ctaLabel ?? "Book my consultation"} <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}