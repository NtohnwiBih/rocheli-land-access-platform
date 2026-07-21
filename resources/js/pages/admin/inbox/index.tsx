import { Head, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Calendar, MessageSquare, Inbox } from "lucide-react";

type ContactStatus = "new" | "read" | "responded";
type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";
type EnquiryStatus = "sent" | "in_review" | "responded";

type ContactItem = {
  id: number;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  status: ContactStatus;
  created_at: string;
};

type AppointmentItem = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time_slot: string;
  status: AppointmentStatus;
  created_at: string;
};

type EnquiryItem = {
  id: number;
  name: string;
  email: string;
  phone: string;
  property_title: string | null;
  message: string;
  status: EnquiryStatus;
  response: string | null;
  created_at: string;
};

interface PageProps {
  contacts: ContactItem[];
  appointments: AppointmentItem[];
  enquiries: EnquiryItem[];
  [key: string]: unknown;
}

type TabKey = "all" | "contacts" | "appointments" | "enquiries";

const contactStatusColor: Record<ContactStatus, string> = {
  new: "bg-rocheli-blue text-white",
  read: "bg-muted text-muted-foreground",
  responded: "bg-emerald-500 text-white",
};

const appointmentStatusColor: Record<AppointmentStatus, string> = {
  pending: "bg-amber-500 text-white",
  confirmed: "bg-emerald-500 text-white",
  cancelled: "bg-destructive text-destructive-foreground",
  completed: "bg-muted text-muted-foreground",
};

const enquiryStatusColor: Record<EnquiryStatus, string> = {
  sent: "bg-rocheli-blue text-white",
  in_review: "bg-rocheli-gold text-rocheli-navy",
  responded: "bg-emerald-500 text-white",
};

export default function AdminInbox() {
  const { props } = usePage<PageProps>();
  const { contacts, appointments, enquiries } = props;

  const [tab, setTab] = useState<TabKey>("all");
  const [viewingContact, setViewingContact] = useState<ContactItem | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<AppointmentItem | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<EnquiryItem | null>(null);

  const tabs: { key: TabKey; label: string; icon: typeof Inbox; count: number }[] = [
    { key: "all", label: "All", icon: Inbox, count: contacts.length + appointments.length + enquiries.length },
    { key: "contacts", label: "Contacts", icon: Mail, count: contacts.filter((c) => c.status === "new").length },
    { key: "appointments", label: "Appointments", icon: Calendar, count: appointments.filter((a) => a.status === "pending").length },
    { key: "enquiries", label: "Enquiries", icon: MessageSquare, count: enquiries.filter((e) => e.status === "sent").length },
  ];

  const openContact = (c: ContactItem) => {
    setViewingContact(c);
    if (c.status === "new") {
      router.post(`/admin/contacts/${c.id}/read`, {}, { preserveScroll: true, preserveState: true });
    }
  };

  const confirmAppointment = (id: number) =>
    router.post(`/admin/appointments/${id}/confirm`, {}, { preserveScroll: true });

  const cancelAppointment = (id: number) =>
    router.post(`/admin/appointments/${id}/cancel`, {}, { preserveScroll: true });

  return (
    <>
      <Head title="Inbox — Admin" />

      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-black md:text-3xl">Inbox</h1>
          <p className="text-sm text-muted-foreground">Contact messages, booked consultations and property enquiries in one place.</p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          {tabs.map((tItem) => (
            <button
              key={tItem.key}
              onClick={() => setTab(tItem.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === tItem.key
                  ? "bg-rocheli-blue text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              <tItem.icon className="h-3.5 w-3.5" />
              {tItem.label}
              {tItem.count > 0 && (
                <Badge className={`ml-1 text-[10px] ${tab === tItem.key ? "bg-white/20 text-white" : "bg-rocheli-blue/10 text-rocheli-blue"}`}>
                  {tItem.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* CONTACTS */}
        {(tab === "all" || tab === "contacts") && (
          <section className="space-y-3">
            {tab === "all" && <h3 className="font-display text-base font-bold">Contact messages</h3>}
            {contacts.length === 0 ? (
              <EmptyState label="No contact messages yet." />
            ) : (
              contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openContact(c)}
                  className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-rocheli-blue/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{c.name}</span>
                      <Badge className={contactStatusColor[c.status]}>{c.status}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{c.message}</p>
                    <div className="mt-1 text-xs text-muted-foreground">{c.interest} · {c.created_at}</div>
                  </div>
                </button>
              ))
            )}
          </section>
        )}

        {/* APPOINTMENTS */}
        {(tab === "all" || tab === "appointments") && (
          <section className="space-y-3">
            {tab === "all" && <h3 className="font-display text-base font-bold">Appointments</h3>}
            {appointments.length === 0 ? (
              <EmptyState label="No appointments booked yet." />
            ) : (
              appointments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <button onClick={() => setViewingAppointment(a)} className="min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{a.name}</span>
                      <Badge className={appointmentStatusColor[a.status]}>{a.status}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{a.date} · {a.time_slot}</div>
                  </button>
                  {a.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="brand" onClick={() => confirmAppointment(a.id)}>Confirm</Button>
                      <Button size="sm" variant="outline" onClick={() => cancelAppointment(a.id)}>Cancel</Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        )}

        {/* ENQUIRIES */}
        {(tab === "all" || tab === "enquiries") && (
          <section className="space-y-3">
            {tab === "all" && <h3 className="font-display text-base font-bold">Property enquiries</h3>}
            {enquiries.length === 0 ? (
              <EmptyState label="No property enquiries yet." />
            ) : (
              enquiries.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setViewingEnquiry(e)}
                  className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-rocheli-blue/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{e.name}</span>
                      <Badge className={enquiryStatusColor[e.status]}>{e.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{e.message}</p>
                    <div className="mt-1 text-xs text-muted-foreground">{e.property_title ?? "—"} · {e.created_at}</div>
                  </div>
                </button>
              ))
            )}
          </section>
        )}
      </div>

      {/* Contact detail dialog */}
      <Dialog open={!!viewingContact} onOpenChange={(o) => !o && setViewingContact(null)}>
        <DialogContent className="max-w-lg">
          {viewingContact && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingContact.name}</DialogTitle>
                <DialogDescription>{viewingContact.created_at}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span> {viewingContact.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {viewingContact.phone}</div>
                <div><span className="text-muted-foreground">Interest:</span> {viewingContact.interest}</div>
                <p className="rounded-xl border border-border p-3">{viewingContact.message}</p>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setViewingContact(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Appointment detail dialog — awaiting your form fields to extend */}
      <Dialog open={!!viewingAppointment} onOpenChange={(o) => !o && setViewingAppointment(null)}>
        <DialogContent className="max-w-lg">
          {viewingAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingAppointment.name}</DialogTitle>
                <DialogDescription>{viewingAppointment.date} · {viewingAppointment.time_slot}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground">Phone:</span> {viewingAppointment.phone}</div>
                {viewingAppointment.email && (
                  <div><span className="text-muted-foreground">Email:</span> {viewingAppointment.email}</div>
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setViewingAppointment(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Enquiry detail dialog */}
      <Dialog open={!!viewingEnquiry} onOpenChange={(o) => !o && setViewingEnquiry(null)}>
        <DialogContent className="max-w-lg">
          {viewingEnquiry && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingEnquiry.property_title ?? "Enquiry"}</DialogTitle>
                <DialogDescription>{viewingEnquiry.created_at}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground">From:</span> {viewingEnquiry.name} · {viewingEnquiry.email}</div>
                <p className="rounded-xl border border-border p-3">{viewingEnquiry.message}</p>
                {viewingEnquiry.response && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Response sent</div>
                    <p className="mt-1 rounded-xl bg-rocheli-blue/5 border border-rocheli-blue/20 p-3">{viewingEnquiry.response}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setViewingEnquiry(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}