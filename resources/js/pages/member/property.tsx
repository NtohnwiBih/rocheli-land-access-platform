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
} from "lucide-react";

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
  title: string;
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
  property: { id: number; title: string; image: string | null };
  message: string;
  status: EnquiryStatus;
  date: string;
};

interface PageProps {
  properties: Property[];
  enquiries: Enquiry[];
  [key: string]: unknown;
}

export default function MyProperty() {
  const { props } = usePage<PageProps>();
  const { properties, enquiries } = props;

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Property | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lightbox, setLightbox] = useState<PropertyMediaItem | null>(null);

  const { data, setData, post, processing, reset } = useForm({
    property_id: null as number | null,
    interest: "info",
    message: "",
  });

  const filtered = properties.filter((p) => {
    const matchesQ =
      p.title.toLowerCase().includes(q.toLowerCase()) ||
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
        toast.error("Couldn't send your enquiry. Please try again.");
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
      <Head title="My Property — Rocheli" />

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-2xl font-black md:text-3xl">My properties</h1>
            <p className="text-sm text-muted-foreground">
              Browse verified listings and send enquiries directly to our allocation team.
            </p>
          </div>
          <Badge className="w-fit bg-rocheli-blue/10 text-rocheli-blue hover:bg-rocheli-blue/15">
            {enquiries.length} enquiry{enquiries.length === 1 ? "" : "ies"} sent
          </Badge>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title or location..."
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Selling Fast">Selling Fast</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listing grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-rocheli-navy/70 via-transparent to-transparent" />
                <Badge className={`absolute left-4 top-4 border-0 ${statusColor[p.status]}`}>
                  {p.status}
                </Badge>
                <div className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-wider text-white/90">
                  {p.type}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-display text-lg font-bold leading-tight">{p.title}</h3>
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
                    From
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
                  {p.status === "Sold" ? "Unavailable" : "Send enquiry"}
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No properties match your search.
            </div>
          )}
        </div>

        {/* Enquiries history */}
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold">My enquiries</h3>
          <p className="text-sm text-muted-foreground">
            Track the status of enquiries you've sent to our team.
          </p>
          <div className="mt-5 space-y-3">
            {enquiries.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No enquiries yet. Send one from any property above.
              </div>
            )}
            {enquiries.map((e) => (
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
                    <span className="font-semibold">{e.property.title}</span>
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
                      {e.status}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{e.message}</p>
                  <div className="mt-1 text-xs text-muted-foreground">Sent {e.date}</div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry dialog */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && closeDialog()}>
          <DialogContent className="max-w-lg">
            {selected && !submitted && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    Enquire about {selected.title}
                  </DialogTitle>
                  <DialogDescription>
                    Our allocation officer will respond within 24 hours.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                  {selected.image ? (
                    <img src={selected.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-muted" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{selected.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {selected.location} · {selected.size}
                    </div>
                  </div>
                  <div className="font-display text-sm font-black text-rocheli-blue-dark">
                    {selected.price}
                  </div>
                </div>

                {selected.media.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Gallery</Label>
                        <div className="grid grid-cols-4 gap-2">
                        {selected.media.map((m) => (
                            <button
                            key={m.id}
                            type="button"
                            onClick={() => setLightbox(m)}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                            >
                            {m.type === "image" ? (
                                <img
                                src={m.src}
                                alt={m.caption ?? ""}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                <PlayCircle className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                            {m.is_featured && (
                                <span className="absolute left-1 top-1 rounded bg-rocheli-gold px-1 text-[9px] font-bold text-rocheli-navy">
                                ★
                                </span>
                            )}
                            </button>
                        ))}
                        </div>
                    </div>
                )}

                <div className="grid gap-3">
                  <div>
                    <Label>I'm interested in</Label>
                    <Select
                      value={data.interest}
                      onValueChange={(v) => setData("interest", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">More information</SelectItem>
                        <SelectItem value="inspection">Site inspection</SelectItem>
                        <SelectItem value="installments">Installment plan</SelectItem>
                        <SelectItem value="reserve">Reserving this plot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="msg">Message</Label>
                    <Textarea
                      id="msg"
                      rows={4}
                      value={data.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData("message", e.target.value)}
                      placeholder="Tell us what you'd like to know..."
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button variant="brand" onClick={submitEnquiry} disabled={processing}>
                    <Send className="mr-1 h-4 w-4" /> {processing ? "Sending..." : "Send enquiry"}
                  </Button>
                </DialogFooter>
              </>
            )}

            {selected && submitted && (
              <div className="py-6 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-xl font-black">Enquiry sent</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We've received your enquiry about <b>{selected.title}</b>. Our allocation team
                  will reach out within 24 hours.
                </p>
                <Button variant="brand" className="mt-5" onClick={closeDialog}>
                  Close
                </Button>
              </div>
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