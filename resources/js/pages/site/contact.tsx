import { Breadcrumb } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Head, useForm } from "@inertiajs/react";
import { ArrowRight, Calendar, Check, MapPin, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Office = { city: string; address: string; phone: string; hours: string };

type Slot = { time: string; available: boolean };

type AvailabilityDay = {
  date: string;
  weekday: number;
  closesAt: string;
  slots: Slot[];
};

type Props = {
  content: {
    hero?: { eyebrow?: string; title?: string; titleAccent?: string; description?: string };
    form?: { title?: string; subtitle?: string };
    booking?: { title?: string; body?: string };
    whatsapp?: { title?: string; subtitle?: string };
    offices?: { items?: Office[] };
  };
  availability?: AvailabilityDay[];
};

const fallbackOffices: Office[] = [
  { city: "Yaound\u00e9", address: "Bastos, Avenue de l'Ind\u00e9pendance", phone: "+237 6 55 11 11 11", hours: "Mon-Fri . 8am - 5pm" },
];

const INTEREST_KEYS = [
  "contact.form.interests.landAccessClub",
  "contact.form.interests.buyProperty",
  "contact.form.interests.investmentAdvisory",
  "contact.form.interests.partnershipPress",
  "contact.form.interests.other",
] as const;

// Maps the app's i18next language code to a full BCP-47 tag Intl understands.
const LOCALE_TAG: Record<string, string> = { en: "en-US", fr: "fr-FR" };

function formatDayButton(dateStr: string, language: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  const tag = LOCALE_TAG[language] ?? "en-US";
  return new Intl.DateTimeFormat(tag, { weekday: "short", day: "numeric" }).format(d);
}

function formatTime(time: string, language: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  const tag = LOCALE_TAG[language] ?? "en-US";
  return new Intl.DateTimeFormat(tag, { hour: "numeric", minute: "2-digit", hour12: tag === "en-US" }).format(d);
}

export default function Contact({ content = {}, availability = [] }: Props) {
  const { t, i18n } = useTranslation();

  // Drives Intl date/time formatting off the SAME language the rest of the
  // site uses (i18next), instead of a hardcoded "en-US".
  const language = i18n.language?.startsWith("fr") ? "fr" : "en";

  const hero = content.hero ?? {};
  const form = content.form ?? {};
  const booking = content.booking ?? {};
  const whatsapp = content.whatsapp ?? {};
  const offices = content.offices?.items?.length ? content.offices.items : fallbackOffices;

  // Interest select uses translated labels as both the value and display text,
  // falling back to English if a translation key is missing.
  const interestValues = INTEREST_KEYS.map((key) => t(key));

  const [days, setDays] = useState<AvailabilityDay[]>(availability);
  const [loadingAvailability, setLoadingAvailability] = useState(availability.length === 0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ date: string; time: string } | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    phone: "",
    email: "",
    interest: interestValues[0] as string,
    message: "",
    appointment_date: "",
    appointment_time: "",
  });

  async function refreshAvailability() {
    try {
      const res = await fetch("/contact/availability", { headers: { Accept: "application/json" } });
      if (res.ok) {
        const json: AvailabilityDay[] = await res.json();
        setDays(json);
      }
    } catch {
      // Keep last known window; the server re-checks the slot on submit anyway.
    } finally {
      setLoadingAvailability(false);
    }
  }

  useEffect(() => {
    if (availability.length === 0) refreshAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!days.length) return;
    if (selectedDate && days.some((d) => d.date === selectedDate)) return;
    const firstWithOpenSlots = days.find((d) => d.slots.some((s) => s.available)) ?? days[0];
    setSelectedDate(firstWithOpenSlots.date);
  }, [days, selectedDate]);

  const selectedDay = useMemo(() => days.find((d) => d.date === selectedDate) ?? null, [days, selectedDate]);

  function selectDay(date: string) {
    setSelectedDate(date);
    setData("appointment_date", date);
    setData("appointment_time", "");
  }

  function selectTime(time: string) {
    if (!selectedDate) return;
    setData("appointment_date", selectedDate);
    setData("appointment_time", time);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.appointment_date || !data.appointment_time) return;

    post("/appointmentt", {
      preserveScroll: true,
      onSuccess: () => {
        setConfirmed({ date: data.appointment_date, time: data.appointment_time });
        reset();
        setSelectedDate(null);
        refreshAvailability();
      },
      onError: () => {
        refreshAvailability();
      },
    });
  }

  const canSubmit = !processing && !!data.appointment_date && !!data.appointment_time;

  return (
    <>
      <Head title={t("contact.meta.title", "Contact - Rocheli Real Properties")}>
        <meta name="description" content={t("contact.meta.description", "Talk to a Rocheli advisor. Book a consultation, visit our offices, or chat on WhatsApp.")} />
        <meta property="og:title" content={t("contact.meta.ogTitle", "Contact Rocheli Real Properties")} />
        <meta property="og:description" content={t("contact.meta.ogDescription", "Book a consultation or visit our office in Yaounde")} />
      </Head>

      <Breadcrumb
        eyebrow={hero.eyebrow ?? t("contact.hero.eyebrow", "Contact us")}
        title={
          <>
            {hero.title ?? t("contact.hero.title", "Let's talk about your")}{" "}
            <span className="italic text-gradient-gold">
              {hero.titleAccent ?? t("contact.hero.titleAccent", "first plot.")}
            </span>
          </>
        }
        description={
          hero.description ??
          t(
            "contact.hero.description",
            "Book a 30-minute consultation with an advisor. Visit our office. Or ping us on WhatsApp - whichever works for you."
          )
        }
      />

      {/* Single form wraps BOTH cards - one submit point drives the whole thing */}
      <form onSubmit={handleSubmit}>
        <section className="py-16">
          <div className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            {confirmed ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-navy text-white p-8 md:p-10 shadow-card-soft flex flex-col items-start"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-gold text-navy">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">{t("contact.confirmed.title", "You're booked")}</h3>
                <p className="mt-2 text-white/70 text-sm">
                  {t("contact.confirmed.subtitle")}
                </p>
                <Button
                  type="button"
                  className="mt-6 bg-gradient-gold text-navy h-11 rounded-xl font-semibold"
                  onClick={() => setConfirmed(null)}
                >
                  {t("contact.confirmed.bookAnother", "Book another slot")}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-card border border-border p-8 md:p-10 shadow-card-soft space-y-5"
              >
                <div>
                  <h2 className="font-display text-3xl font-semibold">
                    {form.title ?? t("contact.form.title", "Send us a message")}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {form.subtitle ?? t("contact.form.subtitle", "We'll respond within one business day.")}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={t("contact.form.fields.name.label", "Full name")}
                    placeholder={t("contact.form.fields.name.placeholder", "Amina Nkeng")}
                    value={data.name}
                    onChange={(v) => setData("name", v)}
                    error={errors.name}
                  />
                  <Field
                    label={t("contact.form.fields.phone.label", "Phone / WhatsApp")}
                    placeholder={t("contact.form.fields.phone.placeholder", "+237 ...")}
                    value={data.phone}
                    onChange={(v) => setData("phone", v)}
                    error={errors.phone}
                  />
                </div>
                <Field
                  label={t("contact.form.fields.email.label", "Email address")}
                  placeholder={t("contact.form.fields.email.placeholder", "you@example.com")}
                  value={data.email}
                  onChange={(v) => setData("email", v)}
                  error={errors.email}
                />
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("contact.form.fields.interest.label", "Interest")}
                  </label>
                  <select
                    value={data.interest}
                    onChange={(e) => setData("interest", e.target.value)}
                    className="mt-2 w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {interestValues.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("contact.form.fields.message.label", "Message")}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={t("contact.form.fields.message.placeholder", "Tell us about your goals...")}
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    className="mt-2 w-full rounded-xl bg-background border border-input px-4 py-3 text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
                {/* No button here - the single submit lives on the booking card. */}
              </motion.div>
            )}

            <div className="space-y-6">
              {!confirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl bg-gradient-navy text-white p-8 relative overflow-hidden grain"
                >
                  <Calendar className="h-8 w-8 text-gold" />
                  <h3 className="mt-4 font-display text-2xl font-semibold">
                    {booking.title ?? t("contact.booking.title", "Book an advisor")}
                  </h3>
                  <p className="mt-2 text-white/70 text-sm">
                    {booking.body ?? t("contact.booking.body", "Pick a 30-minute slot with a Rocheli advisor. Available Mon-Sat.")}
                  </p>

                  {loadingAvailability ? (
                    <p className="mt-6 text-sm text-white/70">
                      {t("contact.booking.loading", "Loading available times...")}
                    </p>
                  ) : (
                    <>
                      <div className="mt-6 grid grid-cols-4 gap-2">
                        {days.map((day) => {
                          const hasOpenSlots = day.slots.some((s) => s.available);
                          const isSelected = day.date === selectedDate;
                          return (
                            <button
                              key={day.date}
                              type="button"
                              disabled={!hasOpenSlots}
                              onClick={() => selectDay(day.date)}
                              className={`rounded-xl px-2 py-3 text-xs font-semibold transition ${
                                isSelected
                                  ? "bg-gradient-gold text-navy"
                                  : hasOpenSlots
                                    ? "bg-white/10 hover:bg-white/20 text-white"
                                    : "bg-white/5 text-white/40 line-through cursor-not-allowed"
                              }`}
                            >
                              {formatDayButton(day.date, language)}
                            </button>
                          );
                        })}
                      </div>

                      {selectedDay && selectedDay.slots.length === 0 && (
                        <p className="mt-3 text-xs text-white/70">
                          {t("contact.booking.noSlotsLeft", "Nothing left that day - try another.")}
                        </p>
                      )}

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {selectedDay?.slots.map((slot) => {
                          const isSelected = data.appointment_time === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => selectTime(slot.time)}
                              className={`rounded-xl py-2 text-xs font-semibold ${
                                isSelected
                                  ? "bg-white text-navy"
                                  : slot.available
                                    ? "bg-white/10 hover:bg-white/20 text-white"
                                    : "bg-white/5 text-white/40 line-through cursor-not-allowed"
                              }`}
                            >
                              {formatTime(slot.time, language)}
                            </button>
                          );
                        })}
                      </div>

                      {(errors.appointment_time || errors.appointment_date) && (
                        <p className="mt-2 text-xs font-semibold text-red-300">
                          {errors.appointment_time ?? errors.appointment_date}
                        </p>
                      )}
                    </>
                  )}

                  {/* The one and only submit button for the whole page */}
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="mt-6 w-full bg-gradient-gold text-navy h-11 rounded-xl font-semibold disabled:opacity-50"
                  >
                    {processing
                      ? t("contact.booking.submitting", "Sending...")
                      : t("contact.booking.submit", "Send message & confirm slot")}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              <a
                href="#"
                className="flex items-center gap-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 p-6 hover:border-emerald-500/50 transition"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 text-white shrink-0">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-lg font-semibold">
                    {whatsapp.title ?? t("contact.whatsapp.title", "Chat on WhatsApp")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {whatsapp.subtitle ?? t("contact.whatsapp.subtitle", "Response time under 15 minutes . 8am - 8pm")}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-emerald-600 ml-auto shrink-0" />
              </a>
            </div>
          </div>
        </section>
      </form>

      <section className="pb-24">
        <div className="container-x">
          <div className="relative aspect-[21/9] rounded-3xl bg-muted overflow-hidden border border-border">
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 30% 40%, rgba(18,152,194,0.2), transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,210,26,0.15), transparent 50%)",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,152,194,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,152,194,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
            {offices.map((o, i) => (
              <div key={o.city} className="absolute" style={{ left: `${20 + i * 25}%`, top: `${40 + (i % 2) * 15}%` }}>
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
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-xl bg-background border px-4 py-3 text-sm outline-none focus:border-primary ${
          error ? "border-red-500" : "border-input"
        }`}
      />
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}