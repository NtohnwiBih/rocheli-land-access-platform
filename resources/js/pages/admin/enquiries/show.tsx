import { Head, Link, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type EnquiryDetail = {
  id: number;
  member_id: number;
  member_name: string;
  member_phone: string;
  member_email: string | null;
  property_id: number;
  property_title: string;
  property_image: string | null;
  interest: string;
  message: string | null;
  status: "sent" | "in_review" | "responded";
  response: string | null;
  created_at: string;
  responded_at: string | null;
};

interface Props {
  enquiry: EnquiryDetail;
}

const statusColor: Record<string, string> = {
  sent: "bg-rocheli-blue text-white",
  in_review: "bg-rocheli-gold text-rocheli-navy",
  responded: "bg-emerald-500 text-white",
};

export default function EnquiryShow({ enquiry }: Props) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    response: enquiry.response ?? "",
  });

  const submit = () => {
    post(`/rocheli/enquiries/${enquiry.id}/respond`, { preserveScroll: true });
  };

  const statusLabel =
    enquiry.status === "sent"
      ? t("admin.enquiries.statusNew")
      : enquiry.status === "in_review"
      ? t("admin.enquiries.statusInReview")
      : t("admin.enquiries.statusResponded");

  return (
    <>
      <Head title={`${t("admin.enquiries.title")} — ${enquiry.member_name}`} />
      <div className="p-4 space-y-6 max-w-3xl">
        <AdminPageHeader
          title={t("admin.enquiries.title")}
          description={`${t("admin.enquiries.colMember")}: ${enquiry.member_name} · ${enquiry.created_at}`}
          action={
            <Link href="/rocheli/enquiries">
              <Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5" /> {t("admin.enquiries.backToList")}</Button>
            </Link>
          }
        />

        <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <Badge className={statusColor[enquiry.status]}>{statusLabel}</Badge>
            <Link href={`/rocheli/members/${enquiry.member_id}`} className="text-sm font-medium text-primary hover:underline">
              {t("admin.enquiries.viewMemberProfile")}
            </Link>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
            {enquiry.property_image && (
              <img src={enquiry.property_image} alt="" className="h-14 w-14 rounded-lg object-cover" />
            )}
            <div>
              <div className="text-sm font-semibold">{enquiry.property_title}</div>
              <Link href={`/rocheli/properties/${enquiry.property_id}/edit`} className="text-xs text-primary hover:underline">
                {t("admin.enquiries.viewListing")}
              </Link>
            </div>
          </div>

          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4 sm:block">
              <dt className="text-muted-foreground">{t("admin.enquiries.colPhone")}</dt>
              <dd className="font-medium">{enquiry.member_phone}</dd>
            </div>
            <div className="flex justify-between gap-4 sm:block">
              <dt className="text-muted-foreground">{t("admin.enquiries.colEmail")}</dt>
              <dd className="font-medium">{enquiry.member_email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 sm:block">
              <dt className="text-muted-foreground">{t("admin.enquiries.colInterestedIn")}</dt>
              <dd className="font-medium">{enquiry.interest}</dd>
            </div>
          </dl>

          {enquiry.message && (
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">{t("admin.enquiries.message")}</Label>
              <p className="mt-1.5 rounded-xl border border-border p-3 text-sm">{enquiry.message}</p>
            </div>
          )}

          <div className="space-y-2 border-t border-border pt-5">
            <Label>{t("admin.enquiries.yourResponse")}</Label>
            <Textarea
              rows={5}
              value={data.response}
              onChange={(e) => setData("response", e.target.value)}
              placeholder={t("admin.enquiries.responsePlaceholder")}
            />
            {errors.response && <p className="text-xs text-destructive">{errors.response}</p>}
            {enquiry.responded_at && (
              <p className="text-xs text-muted-foreground">
                {t("admin.enquiries.lastResponded", { date: enquiry.responded_at })}
              </p>
            )}
            <div className="flex justify-end">
              <Button onClick={submit} disabled={processing} className="bg-gradient-blue text-white">
                {processing
                  ? t("admin.enquiries.sending")
                  : enquiry.response
                  ? t("admin.enquiries.updateResponse")
                  : t("admin.enquiries.sendResponse")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}