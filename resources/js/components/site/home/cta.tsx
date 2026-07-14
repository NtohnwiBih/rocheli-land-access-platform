import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { Eyebrow } from "../section";
import { Button } from "@/components/ui/button";

export default function ContactCTA() {
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
                Ready when you are
              </Eyebrow>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-white">
                Talk to an advisor.{" "}
                <span className="italic text-gradient-gold">Own your first plot.</span>
              </h2>
              <p className="mt-4 text-white/70 max-w-lg">
                Book a 30-minute consultation. We'll walk you through eligibility,
                available inventory and the best plan for your goals.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { icon: MapPin, t: "Bonapriso HQ · Douala, Cameroon" },
                  { icon: Phone, t: "+237 6 55 00 00 00" },
                  { icon: MessageCircle, t: "WhatsApp available 8am – 8pm" },
                ].map((r) => (
                  <div key={r.t} className="flex items-center gap-3 text-white/80">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 border border-white/15">
                      <r.icon className="h-4 w-4 text-gold" />
                    </span>
                    <span className="text-sm">{r.t}</span>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="glass rounded-3xl p-6 md:p-8 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  placeholder="Full name"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold min-w-0"
                />
                <input
                  placeholder="Phone / WhatsApp"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold min-w-0"
                />
              </div>
              <input
                placeholder="Email address"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold"
              />
              <select className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white outline-none focus:border-gold">
                <option className="text-navy">I'm interested in…</option>
                <option className="text-navy">Land Access Club membership</option>
                <option className="text-navy">Buying a specific property</option>
                <option className="text-navy">Investment advisory</option>
              </select>
              <textarea
                rows={4}
                placeholder="Tell us about your goals…"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold resize-none"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-gold text-navy hover:opacity-95 h-12 rounded-xl font-semibold"
              >
                Book my consultation <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}