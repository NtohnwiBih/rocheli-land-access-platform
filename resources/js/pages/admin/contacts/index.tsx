import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Check, Trash2, ChevronRight, X, CalendarClock } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Item = {
  id: number;
  type: "contact" | "appointment" | "enquiry";
  name: string;
  phone: string;
  email: string | null;
  summary: string;
  status: string;
  created_at: string;
};

interface Props {
  tab: string;
  counts: {
    all: number;
    contacts: number;
    appointments: number;
    enquiries: number;
    unhandled_contacts: number;
    pending_appointments: number;
    new_enquiries: number;
  };
  all: Item[];
  contacts: Item[];
  appointments: Item[];
  enquiries: Item[];
}

const statusColor: Record<string, string> = {
  new: "bg-rocheli-blue text-white",
  handled: "bg-muted text-muted-foreground",
  pending: "bg-rocheli-gold text-rocheli-navy",
  confirmed: "bg-emerald-500 text-white",
  cancelled: "bg-destructive text-destructive-foreground",
  sent: "bg-rocheli-blue text-white",
  in_review: "bg-rocheli-gold text-rocheli-navy",
  responded: "bg-emerald-500 text-white",
};

const typeBadge: Record<Item["type"], string> = {
  contact: "Contact",
  appointment: "Appointment",
  enquiry: "Enquiry",
};

export default function ContactCenterIndex({ tab: initialTab, counts, all, contacts, appointments, enquiries }: Props) {
  const [tab, setTab] = useState(initialTab || "all");

  const switchTab = (t: string) => {
    setTab(t);
    router.get("/rocheli/contacts", { tab: t }, { preserveState: true, preserveScroll: true, replace: true });
  };

  const dataForTab: Item[] =
    tab === "contacts" ? contacts : tab === "appointments" ? appointments : tab === "enquiries" ? enquiries : all;

  const markContactHandled = (id: number) => {
    router.post(`/rocheli/contacts/${id}/handled`, {}, { preserveScroll: true });
  };

  const deleteContact = (id: number) => {
    if (!confirm("Delete this message?")) return;
    router.delete(`/rocheli/contacts/${id}`, { preserveScroll: true });
  };

  const confirmAppointment = (id: number) => {
    router.post(`/rocheli/appointments/${id}/confirm`, {}, { preserveScroll: true });
  };

  const cancelAppointment = (id: number) => {
    if (!confirm("Cancel this appointment?")) return;
    router.post(`/rocheli/appointments/${id}/cancel`, {}, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Contact Center" />
      <div className="p-4 space-y-6">
        <AdminPageHeader
          title="Contact Center"
          description="Messages, consultation requests, and property enquiries in one place."
        />

        <div className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-muted p-1">
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "contacts", label: "Contacts", count: counts.unhandled_contacts },
            { key: "appointments", label: "Appointments", count: counts.pending_appointments },
            { key: "enquiries", label: "Enquiries", count: counts.new_enquiries },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => switchTab(t.key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                tab === t.key ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className="rounded-full bg-rocheli-gold px-1.5 text-[10px] font-bold text-rocheli-navy">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <AdminTable headers={["Type", "Name", "Contact", "Details", "Received", "Status", ""]}>
          {dataForTab.map((item) => (
            <TableRow key={`${item.type}-${item.id}`}>
              <TableCell>
                <Badge variant="outline">{typeBadge[item.type]}</Badge>
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {item.phone}{item.email ? ` · ${item.email}` : ""}
              </TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">{item.summary}</TableCell>
              <TableCell className="text-muted-foreground">{item.created_at}</TableCell>
              <TableCell>
                <Badge className={statusColor[item.status] ?? ""}>
                  {item.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  {item.type === "contact" && item.status === "new" && (
                    <Button size="icon" variant="ghost" onClick={() => markContactHandled(item.id)}>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    </Button>
                  )}
                  {item.type === "contact" && (
                    <Button size="icon" variant="ghost" onClick={() => deleteContact(item.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}

                  {item.type === "appointment" && item.status === "pending" && (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => confirmAppointment(item.id)}>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => cancelAppointment(item.id)}>
                        <X className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </>
                  )}

                  {item.type === "enquiry" && (
                    <Link href={`/rocheli/enquiries/${item.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      View <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {dataForTab.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                <CalendarClock className="mx-auto mb-2 h-6 w-6 opacity-40" />
                Nothing here yet.
              </TableCell>
            </TableRow>
          )}
        </AdminTable>
      </div>
    </>
  );
}