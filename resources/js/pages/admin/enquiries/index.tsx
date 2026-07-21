import { Head, Link, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

type Enquiry = {
  id: number;
  member_name: string;
  property_title: string;
  interest: string;
  message: string | null;
  status: "sent" | "in_review" | "responded";
  created_at: string;
};

interface Props {
  enquiries: Enquiry[];
  filters: { status?: string };
}

const statusColor: Record<string, string> = {
  sent: "bg-rocheli-blue text-white",
  in_review: "bg-rocheli-gold text-rocheli-navy",
  responded: "bg-emerald-500 text-white",
};

export default function EnquiriesIndex({ enquiries, filters }: Props) {
  const { t } = useTranslation();

  const filterByStatus = (status: string) => {
    router.get("/rocheli/enquiries", status === "all" ? {} : { status }, { preserveState: true, replace: true });
  };

  const statusLabel = (status: Enquiry["status"]) =>
    status === "sent"
      ? t("admin.enquiries.statusNew")
      : status === "in_review"
      ? t("admin.enquiries.statusInReview")
      : t("admin.enquiries.statusResponded");

  return (
    <>
      <Head title={t("admin.enquiries.title")} />
      <div className="p-4 space-y-6">
        <AdminPageHeader
          title={t("admin.enquiries.title")}
          description={t("admin.enquiries.subtitle")}
          action={
            <Select value={filters.status ?? "all"} onValueChange={filterByStatus}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.enquiries.filterAll")}</SelectItem>
                <SelectItem value="sent">{t("admin.enquiries.filterNew")}</SelectItem>
                <SelectItem value="in_review">{t("admin.enquiries.filterInReview")}</SelectItem>
                <SelectItem value="responded">{t("admin.enquiries.filterResponded")}</SelectItem>
              </SelectContent>
            </Select>
          }
        />

        <AdminTable
          headers={[
            t("admin.enquiries.colMember"),
            t("admin.enquiries.colProperty"),
            t("admin.enquiries.colInterest"),
            t("admin.enquiries.colReceived"),
            t("admin.enquiries.colStatus"),
            "",
          ]}
        >
          {enquiries.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.member_name}</TableCell>
              <TableCell className="text-muted-foreground">{e.property_title}</TableCell>
              <TableCell className="text-muted-foreground">{e.interest}</TableCell>
              <TableCell className="text-muted-foreground">{e.created_at}</TableCell>
              <TableCell>
                <Badge className={statusColor[e.status]}>{statusLabel(e.status)}</Badge>
              </TableCell>
              <TableCell>
                <Link href={`/rocheli/enquiries/${e.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  {t("admin.enquiries.view")} <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {enquiries.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                {t("admin.enquiries.empty")}
              </TableCell>
            </TableRow>
          )}
        </AdminTable>
      </div>
    </>
  );
}