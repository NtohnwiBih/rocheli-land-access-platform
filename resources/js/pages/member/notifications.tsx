import { Head, Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Bell, Wallet, Sparkles, ChevronRight } from "lucide-react";

type Tone = "success" | "info" | "gold";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  tone: Tone;
  read_at: string | null;
  created_at: string;
};

interface PageProps {
  notifications: NotificationItem[];
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

export default function Notifications() {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const notifications = props.notifications;
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markAllRead = () => {
    router.post("/member/notifications/read-all", {}, { preserveScroll: true });
  };

  return (
    <>
      <Head title={`${t("member.notifications.title")} — Rocheli`} />
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black md:text-3xl">{t("member.notifications.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("member.notifications.subtitle")}</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm font-medium text-rocheli-blue hover:underline">
              {t("member.notifications.markAllRead")}
            </button>
          )}
        </div>

        <div className="rounded-3xl bg-card shadow-card divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t("member.notifications.empty")}
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = toneIcon[n.tone] ?? Bell;
              return (
                <Link
                  key={n.id}
                  href={`/member/notifications/${n.id}`}
                  className="flex items-center gap-4 p-5 transition-colors hover:bg-muted/40"
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClasses[n.tone] ?? toneClasses.info}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className={`truncate ${n.read_at ? "font-medium" : "font-semibold"}`}>
                        {n.title}
                        {!n.read_at && (
                          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-rocheli-gold align-middle" />
                        )}
                      </div>
                      <div className="shrink-0 text-xs text-muted-foreground">{n.created_at}</div>
                    </div>
                    <div className="truncate text-sm text-muted-foreground">{n.body}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}