import { Head, Link, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, Wallet, Sparkles } from "lucide-react";

type Tone = "success" | "info" | "gold";

interface NotificationDetail {
  id: string;
  title: string;
  body: string;
  tone: Tone;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  created_at_human: string;
}

interface PageProps {
  notification: NotificationDetail;
  [key: string]: unknown;
}

const toneIcon: Record<Tone, typeof Bell> = {
  success: Wallet,
  gold: Sparkles,
  info: Bell,
};

const toneClasses: Record<Tone, string> = {
  success: "bg-emerald-500/10 text-emerald-600",
  gold: "bg-rocheli-gold/20 text-rocheli-gold-dark",
  info: "bg-rocheli-blue/10 text-rocheli-blue",
};

export default function NotificationDetail() {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const n = props.notification;
  const Icon = toneIcon[n.tone] ?? Bell;

  const extraFields = Object.entries(n.data ?? {}).filter(
    ([key]) => !["title", "body", "tone"].includes(key)
  );

  return (
    <>
      <Head title={`${n.title} — Rocheli`} />
      <div className="space-y-6">
        <Link
          href="/member/notifications"
          className="inline-flex items-center gap-1 text-sm font-medium text-rocheli-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> {t("member.notificationDetail.back")}
        </Link>

        <div className="rounded-3xl bg-card p-6 shadow-card md:p-8">
          <div className="flex items-start gap-4">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${toneClasses[n.tone] ?? toneClasses.info}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold">{n.title}</h1>
                {!n.read_at && <Badge className="bg-rocheli-gold text-rocheli-navy">{t("member.notificationDetail.new")}</Badge>}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{n.created_at_human}</div>
            </div>
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-foreground">
            {n.body}
          </p>

          {extraFields.length > 0 && (
            <div className="mt-6 space-y-2 rounded-xl bg-muted p-4 text-sm">
              {extraFields.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span className="capitalize text-muted-foreground">{key.replace(/_/g, " ")}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}