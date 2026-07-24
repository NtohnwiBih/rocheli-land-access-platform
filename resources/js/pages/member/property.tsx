import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  MapPin,
  Ruler,
  Search,
  MessageCircle,
  Send,
  CheckCircle2,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// `title` (and any other translatable model attribute) can come back from
// the backend as either a plain string or a locale map like
// { en: "...", fr: "..." } depending on how a given controller resolved it.
// This keeps every render/filter site safe regardless of shape, rather than
// trusting each controller to always call titleForLocale().
type Localized = string | Partial<Record<string, string>> | null | undefined;

function localize(value: Localized, locale = "en"): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.en ?? value.fr ?? Object.values(value)[0] ?? "";
}

type PropertyStatus = "Available" | "Reserved" | "Sold" | "Selling Fast";

type PropertyMediaItem = {
  id: number;
  type: "image" | "video";
  src: string;
  caption: string | null;
  is_featured: boolean;
};

type Property = {
  id: number;
  title: Localized;
  location: string;
  size: string;
  type: string;
  price: string;
  image: string | null;
  status: PropertyStatus;
  media: PropertyMediaItem[];
};

type EnquiryStatus = "Sent" | "In review" | "Responded";

type Enquiry = {
  id: number;
  property: { id: number; title: Localized; image: string | null };
  message: string;
  status: EnquiryStatus;
  response: string | null;
  date: string;
};

interface PageProps {
  properties: Property[];
  enquiries: Enquiry[];
  locale?: string;
  [key: string]: unknown;
}

export default function MyProperty() {
  const { props } = usePage<PageProps>();
  const { properties, enquiries } = props;
  const locale = props.locale ?? "en";

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Property | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lightbox, setLightbox] = useState<PropertyMediaItem | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);
  const { t } = useTranslation();

  const { data, setData, post, processing, reset } = useForm({
    property_id: null as number | null,
    interest: "info",
    message: "",
  });

  const filtered = properties.filter((p) => {
    const title = localize(p.title, locale);
    const matchesQ =
      title.toLowerCase().includes(q.toLowerCase()) ||
      p.location.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  const openEnquiry = (p: Property) => {
    setSelected(p);
    setSubmitted(false);
    setData({ property_id: p.id, interest: "info", message: "" });
  };

  const submitEnquiry = () => {
    if (!selected) return;
    post("/member/property/enquiries", {
      preserveScroll: true,
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: () => {
        toast.error(t("property.myProperty.errorToast"));
      },
    });
  };

  const closeDialog = () => {
    setSelected(null);
    setSubmitted(false);
    reset();
  };

  const statusColor: Record<PropertyStatus, string> = {
    Available: "bg-emerald-500/90 text-white",
    Reserved: "bg-rocheli-gold text-rocheli-navy",
    Sold: "bg-muted text-muted-foreground",
    "Selling Fast": "bg-rocheli-blue text-white",
  };

  return (
    <>
      <Head title={`${t("property.myProperty.title")} — Rocheli`} />

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-2xl font-black md:text-3xl">{t("property.myProperty.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("property.myProperty.subtitle")}</p>
          </div>
          <Badge className="w-fit bg-rocheli-blue/10 text-rocheli-blue hover:bg-rocheli-blue/15">
            {t("property.myProperty.enquirySent", { count: enquiries.length })}
          </Badge>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("property.myProperty.searchPlaceholder")}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("property.myProperty.allStatuses")}</SelectItem>
              <SelectItem value="Available">{t("property.myProperty.statuses.Available")}</SelectItem>
              <SelectItem value="Selling Fast">{t("property.myProperty.statuses.Selling Fast")}</SelectItem>
              <SelectItem value="Reserved">{t("property.myProperty.statuses.Reserved")}</SelectItem>
              <SelectItem value="Sold">{t("property.myProperty.statuses.Sold")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listing grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const title = localize(p.title, locale);
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-rocheli-navy/70 via-transparent to-transparent" />
                  <Badge className={`absolute left-4 top-4 border-0 ${statusColor[p.status]}`}>
                    {t(`property.myProperty.statuses.${p.status}`)}
                  </Badge>
                  <div className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-wider text-white/90">
                    {p.type}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rocheli-blue" /> {p.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Ruler className="h-3.5 w-3.5 text-rocheli-blue" /> {p.size}
                    </span>
                  </div>
                  <div className="mt-1 border-t border-border pt-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t("property.myProperty.from")}
                    </div>
                    <div className="font-display text-xl font-extrabold text-rocheli-blue-dark">
                      {p.price}
                    </div>
                  </div>
                  <Button
                    variant="brand"
                    className="mt-2 w-full"
                    onClick={() => openEnquiry(p)}
                    disabled={p.status === "Sold"}
                  >
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {p.status === "Sold" ? t("property.myProperty.unavailable") : t("property.myProperty.sendEnquiry")}
                  </Button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              {t("property.myProperty.noMatch")}
            </div>
          )}
        </div>

        {/* Enquiries history */}
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold">{t("property.myProperty.myEnquiries.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("property.myProperty.myEnquiries.subtitle")}</p>
          <div className="mt-5 space-y-3">
            {enquiries.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                {t("property.myProperty.myEnquiries.empty")}
              </div>
            )}
            {enquiries.map((e) => {
              const propertyTitle = localize(e.property.title, locale);
              return (
                <div
                  key={e.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center"
                >
                  {e.property.image ? (
                    <img
                      src={e.property.image}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-xl bg-muted" />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{propertyTitle}</span>
                      <Badge
                        variant="outline"
                        className={
                          e.status === "Responded"
                            ? "border-emerald-500/40 text-emerald-600"
                            : e.status === "In review"
                              ? "border-rocheli-gold/60 text-rocheli-gold"
                              : "border-rocheli-blue/40 text-rocheli-blue"
                        }
                      >
                        {t(`property.myProperty.myEnquiries.statuses.${e.status}`)}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{e.message}</p>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {t("property.myProperty.myEnquiries.sentOn", { date: e.date })}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setViewingEnquiry(e)}>
                    {t("property.myProperty.myEnquiries.view")}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Send enquiry dialog */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && closeDialog()}>
          <DialogContent className="max-w-md">
            {selected && !submitted && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    {t("property.sendEnquiry.title", { defaultValue: "Send an enquiry" })}
                  </DialogTitle>
                  <DialogDescription>
                    {t("property.sendEnquiry.subtitle", {
                      defaultValue: "Our team typically responds within 24 hours.",
                    })}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                  {selected.image ? (
                    <img
                      src={selected.image}
                      alt={localize(selected.title, locale)}
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-muted" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{localize(selected.title, locale)}</div>
                    <div className="truncate text-sm text-muted-foreground">{selected.location}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="interest">
                      {t("property.sendEnquiry.interestLabel", { defaultValue: "I'm interested in" })}
                    </Label>
                    <Select value={data.interest} onValueChange={(v) => setData("interest", v)}>
                      <SelectTrigger id="interest" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">
                          {t("property.sendEnquiry.interests.info", { defaultValue: "General information" })}
                        </SelectItem>
                        <SelectItem value="buy">
                          {t("property.sendEnquiry.interests.buy", { defaultValue: "Buying this property" })}
                        </SelectItem>
                        <SelectItem value="visit">
                          {t("property.sendEnquiry.interests.visit", { defaultValue: "Scheduling a site visit" })}
                        </SelectItem>
                        <SelectItem value="financing">
                          {t("property.sendEnquiry.interests.financing", {
                            defaultValue: "Financing / installments",
                          })}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">
                      {t("property.sendEnquiry.messageLabel", { defaultValue: "Message (optional)" })}
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={data.message}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData("message", e.target.value)}
                      placeholder={t("property.sendEnquiry.messagePlaceholder", {
                        defaultValue: "Anything specific you'd like to know?",
                      })}
                      className="mt-1.5 resize-none"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog} disabled={processing}>
                    {t("property.sendEnquiry.cancel", { defaultValue: "Cancel" })}
                  </Button>
                  <Button variant="brand" onClick={submitEnquiry} disabled={processing}>
                    {processing ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        {t("property.sendEnquiry.sending", { defaultValue: "Sending…" })}
                      </>
                    ) : (
                      <>
                        <Send className="mr-1 h-4 w-4" />
                        {t("property.sendEnquiry.send", { defaultValue: "Send enquiry" })}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}

            {selected && submitted && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <h3 className="font-display text-lg font-bold">
                  {t("property.sendEnquiry.successTitle", { defaultValue: "Enquiry sent" })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("property.sendEnquiry.successMessage", {
                    defaultValue: "Our team will get back to you within 24 hours.",
                  })}
                </p>
                <Button variant="brand" onClick={closeDialog} className="mt-2">
                  {t("property.sendEnquiry.done", { defaultValue: "Done" })}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Enquiry dialog */}
        <Dialog open={!!viewingEnquiry} onOpenChange={(o) => !o && setViewingEnquiry(null)}>
          <DialogContent className="max-w-lg">
            {viewingEnquiry && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    {localize(viewingEnquiry.property.title, locale)}
                  </DialogTitle>
                  <DialogDescription>
                    {t("property.enquiryDialog.sentOn", { date: viewingEnquiry.date })}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("property.enquiryDialog.yourMessage")}
                    </div>
                    <p className="mt-1 rounded-xl border border-border p-3 text-sm">{viewingEnquiry.message}</p>
                  </div>

                  {viewingEnquiry.response ? (
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {t("property.enquiryDialog.teamResponse")}
                      </div>
                      <p className="mt-1 rounded-xl bg-rocheli-blue/5 border border-rocheli-blue/20 p-3 text-sm">
                        {viewingEnquiry.response}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
                      {t("property.enquiryDialog.noResponseYet")}
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
            <DialogContent className="max-w-3xl">
                {lightbox && (
                lightbox.type === "image" ? (
                    <img src={lightbox.src} alt={lightbox.caption ?? ""} className="max-h-[75vh] w-full rounded-xl object-contain" />
                ) : (
                    <video src={lightbox.src} controls autoPlay className="max-h-[75vh] w-full rounded-xl" />
                )
                )}
                {lightbox?.caption && (
                <p className="text-center text-sm text-muted-foreground">{lightbox.caption}</p>
                )}
            </DialogContent>
        </Dialog>
      </div>
    </>
  );
}