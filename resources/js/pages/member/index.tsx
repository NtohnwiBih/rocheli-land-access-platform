import { Head, Link, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Wallet,
  TrendingUp,
  Landmark,
  Clock,
  Download,
  Building2,
  MessageCircle,
  Sparkles,
  Bell,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface PageProps {
  auth: {
    user: {
      name: string;
      email: string;
      member_code?: string;
      plan?: string;
      avatar?: string;
    };
  };
  member?: {
    goal: string;
    preferred_locations: string[];
    land_type: string;
    plan: string;
    contribution_frequency: string;
    contribution_amount: string;
    payment_method: string;
    status: "pending" | "under_review" | "approved" | "rejected";
    submitted_at: string;
  };
  [key: string]: unknown;
}

const savingsData = [
  { m: "Jan", v: 75 }, { m: "Feb", v: 150 }, { m: "Mar", v: 225 },
  { m: "Apr", v: 300 }, { m: "May", v: 375 }, { m: "Jun", v: 450 },
  { m: "Jul", v: 525 }, { m: "Aug", v: 600 },
];

export default function DashboardOverview() {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const user = props.auth?.user;
  const member = props.member;

  const firstName = user?.name?.split(" ")[0] ?? t("layout.defaultMemberName");

  const stats = [
    { label: t("member.dashboard.stats.walletBalance"), value: "₦2,325,000", icon: Wallet, tone: "blue", delta: "+₦75,000" },
    { label: t("member.dashboard.stats.contributionsMade"), value: "31", icon: TrendingUp, tone: "gold", delta: t("member.dashboard.stats.consecutiveMonths") },
    { label: t("member.dashboard.stats.outstanding"), value: "₦1,425,000", icon: Clock, tone: "muted", delta: t("member.dashboard.stats.forReservedPlot") },
    { label: t("member.dashboard.stats.plotReserved"), value: "Palm Estate", icon: Landmark, tone: "blue", delta: "500 sqm · Lekki" },
  ];

  const payments = [
    { d: "Oct 1", label: t("member.dashboard.upcomingPayments"), amount: "₦75,000", status: t("member.dashboard.scheduled") },
    { d: "Sep 1", label: t("member.dashboard.upcomingPayments"), amount: "₦75,000", status: t("member.dashboard.paid") },
    { d: "Aug 15", label: t("member.dashboard.upcomingPayments"), amount: "₦250,000", status: t("member.dashboard.paid") },
  ];

  const notifications = [
    { title: "Contribution successful", body: "₦75,000 · Sep 1", tone: "success" },
    { title: "New estate launching", body: "Emerald Heights — Enugu", tone: "info" },
    { title: "Document ready", body: "Deed of Assignment", tone: "gold" },
  ];

  const statusLabel = () => {
    if (!member?.status) return t("member.dashboard.propertyStatus.none");
    return t(`member.dashboard.propertyStatus.${member.status === "under_review" ? "underReview" : member.status}`);
  };

  return (
    <>
      <Head title="Dashboard — Rocheli">
        <meta name="robots" content="noindex" />
      </Head>

      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-dashboard p-6 text-white shadow-elegant md:p-10">
          <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <Badge className="mb-3 border-white/20 bg-white/10 text-white">
                <Sparkles className="mr-1 h-3 w-3 text-rocheli-gold" />{" "}
                {user?.plan ?? member?.plan ?? t("member.dashboard.noPlanSelected")}{" "}
                {(user?.plan ?? member?.plan) && t("member.dashboard.planSuffix")}
              </Badge>
              <h1 className="font-display text-3xl font-black md:text-4xl">
                {t("member.dashboard.welcomeBack", { name: firstName })}
              </h1>
              <p className="mt-2 text-sm text-white/70">
                {t("member.dashboard.memberId", { code: user?.member_code ?? "—" })}
                {user?.created_at && ` · Enrolled ${new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="gold" size="lg"><Plus className="mr-1 h-4 w-4" /> {t("member.dashboard.makeContribution")}</Button>
              <Button variant="hero" size="lg"><Download className="mr-1 h-4 w-4" /> {t("member.dashboard.statement")}</Button>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.tone === "gold" ? "bg-gradient-gold text-rocheli-navy" : s.tone === "muted" ? "bg-muted text-foreground" : "bg-gradient-brand text-white"}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-display text-2xl font-black">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart + property status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold">{t("member.dashboard.savingsJourney")}</h3>
                  <p className="text-xs text-muted-foreground">{t("member.dashboard.last8Months")}</p>
                </div>
                <Badge variant="secondary">+₦525,000</Badge>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={savingsData}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--rocheli-blue)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--rocheli-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="m" fontSize={12} stroke="currentColor" strokeOpacity={0.5} />
                    <YAxis fontSize={12} stroke="currentColor" strokeOpacity={0.5} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-card)" }} formatter={(v) => `₦${v}k`} />
                    <Area type="monotone" dataKey="v" stroke="var(--rocheli-blue)" strokeWidth={2.5} fill="url(#g)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Property status */}
            <div className="overflow-hidden rounded-3xl bg-card shadow-card">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Badge
                    className={
                      member?.status === "approved"
                        ? "bg-emerald-500 text-white"
                        : member?.status === "rejected"
                        ? "bg-destructive text-destructive-foreground"
                        : member?.status === "under_review"
                        ? "bg-rocheli-blue text-white"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {statusLabel()}
                  </Badge>
                  {member?.plan && <Badge variant="secondary">{member.plan}</Badge>}
                </div>

                <h3 className="mt-3 font-display text-xl font-bold">
                  {member?.land_type ?? "Land"} · {member?.goal ?? "—"}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {member?.preferred_locations?.length
                    ? t(
                        member.preferred_locations.length > 1
                          ? "member.dashboard.propertyStatus.locations_other"
                          : "member.dashboard.propertyStatus.locations_one",
                        { list: member.preferred_locations.join(", ") }
                      )
                    : t("member.dashboard.propertyStatus.notSpecified")}
                </p>

                {member?.status === "approved" ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {t("member.dashboard.propertyStatus.approvedNote", {
                      link: t("member.dashboard.propertyStatus.myPropertyLink"),
                    })}
                  </p>
                ) : (
                  <p className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                    {t("member.dashboard.propertyStatus.pendingNote")}
                  </p>
                )}

                <div className="mt-6 flex gap-2">
                  <Link href="/member/property">
                    <Button variant="brand" size="sm">
                      {member?.status === "approved"
                        ? t("member.dashboard.propertyStatus.viewProperty")
                        : t("member.dashboard.propertyStatus.viewApplication")}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="mr-1 h-3.5 w-3.5" /> {t("member.dashboard.propertyStatus.askAdvisor")}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-bold">{t("member.dashboard.upcomingPayments")}</h3>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {payments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div>
                      <div className="text-sm font-semibold">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.d}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{p.amount}</div>
                      <Badge variant={p.status === t("member.dashboard.paid") ? "secondary" : "outline"} className="mt-0.5 text-[10px]">
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-card p-6 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-bold">{t("member.dashboard.notificationsTitle")}</h3>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.title} className="flex gap-3">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.tone === "success" ? "bg-emerald-500" : n.tone === "gold" ? "bg-rocheli-gold" : "bg-rocheli-blue"}`} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{n.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{n.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}