import { Breadcrumb } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";
import { ArrowRight, Calendar, MapPin, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Resources() {

    const offices = [
        // { city: "Douala HQ", address: "Bonapriso, Rue de la Réunification", phone: "+237 6 55 00 00 00", hours: "Mon–Sat · 8am – 6pm" },
        { city: "Yaoundé", address: "Bastos, Avenue de l'Indépendance", phone: "+237 6 55 11 11 11", hours: "Mon–Fri · 8am – 5pm" },
        // { city: "Buea", address: "Molyko, University Road", phone: "+237 6 55 22 22 22", hours: "Mon–Fri · 9am – 5pm" },
    ];

    return (
        <>
          <Head title="Contact — Rocheli Real Properties">
            <meta
            name="description"
            content="Talk to a Rocheli advisor. Book a consultation, visit our offices, or chat on WhatsApp."
            />
            <meta property="og:title" content="Contact Rocheli Real Properties" />
            <meta
            property="og:description"
            content="Book a consultation or visit our office in Yaoundé"
            />
          </Head>

          <Breadcrumb
            eyebrow="Contact us"
            title={
                <>
                 Let's talk about your{" "}
                <span className="italic text-gradient-gold">first plot.</span>
                </>
            }
            description="Book a 30-minute consultation with an advisor. Visit our office.
            Or ping us on WhatsApp — whichever works for you."
          />

          <section className="py-16">
            <div className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <motion.form
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={(e) => e.preventDefault()}
                className="rounded-3xl bg-card border border-border p-8 md:p-10 shadow-card-soft space-y-5"
            >
                <div>
                <h2 className="font-display text-3xl font-semibold">Send us a message</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    We'll respond within one business day.
                </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" placeholder="Amina Nkeng" />
                <Field label="Phone / WhatsApp" placeholder="+237 …" />
                </div>
                <Field label="Email address" placeholder="you@example.com" />
                <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Interest
                </label>
                <select className="mt-2 w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary">
                    <option>Land Access Club membership</option>
                    <option>Buying a specific property</option>
                    <option>Investment advisory</option>
                    <option>Partnership / press</option>
                    <option>Other</option>
                </select>
                </div>
                <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Message
                </label>
                <textarea
                    rows={5}
                    placeholder="Tell us about your goals…"
                    className="mt-2 w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary resize-none"
                />
                </div>
                <Button className="w-full bg-gradient-blue text-white h-12 rounded-xl font-semibold shadow-glow">
                Send message <ArrowRight className="h-4 w-4" />
                </Button>
            </motion.form>

            <div className="space-y-6">
                <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-navy text-white p-8 relative overflow-hidden grain"
                >
                <Calendar className="h-8 w-8 text-gold" />
                <h3 className="mt-4 font-display text-2xl font-semibold">
                    Book an advisor
                </h3>
                <p className="mt-2 text-white/70 text-sm">
                    Pick a 30-minute slot with a Rocheli advisor. Available Mon–Sat.
                </p>
                <div className="mt-6 grid grid-cols-4 gap-2">
                    {["Mon 09", "Tue 10", "Wed 11", "Thu 12", "Fri 13", "Sat 14", "Mon 16", "Tue 17"].map(
                    (d, i) => (
                        <button
                        key={d}
                        className={`rounded-xl px-2 py-3 text-xs font-semibold transition ${
                            i === 2
                            ? "bg-gradient-gold text-navy"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                        >
                        {d}
                        </button>
                    )
                    )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {["10:00", "11:30", "14:00", "15:30", "16:30", "17:00"].map((t, i) => (
                    <button
                        key={t}
                        className={`rounded-xl py-2 text-xs font-semibold ${
                        i === 1
                            ? "bg-white text-navy"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                    >
                        {t}
                    </button>
                    ))}
                </div>
                <Button className="mt-6 w-full bg-gradient-gold text-navy h-11 rounded-xl font-semibold">
                    Confirm slot
                </Button>
                </motion.div>

                <a
                href="#"
                className="flex items-center gap-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 p-6 hover:border-emerald-500/50 transition"
                >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 text-white shrink-0">
                    <MessageCircle className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                    <div className="font-display text-lg font-semibold">Chat on WhatsApp</div>
                    <div className="text-sm text-muted-foreground">
                    Response time under 15 minutes · 8am – 8pm
                    </div>
                </div>
                <ArrowRight className="h-5 w-5 text-emerald-600 ml-auto shrink-0" />
                </a>
            </div>
            </div>
          </section>

           <section className="pb-24">
        <div className="container-x">
          <div className="relative aspect-[21/9] rounded-3xl bg-muted overflow-hidden border border-border">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 40%, rgba(18,152,194,0.2), transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,210,26,0.15), transparent 50%)",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,152,194,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,152,194,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
            {offices.map((o, i) => (
              <div
                key={o.city}
                className="absolute"
                style={{ left: `${20 + i * 25}%`, top: `${40 + (i % 2) * 15}%` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
                  <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-blue text-white shadow-glow">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-2 rounded-lg bg-card border border-border px-3 py-1 text-xs font-semibold shadow-card-soft whitespace-nowrap">
                  {o.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        </>
    )
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}