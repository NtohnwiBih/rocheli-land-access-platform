import { Head, Link, router, usePage } from "@inertiajs/react";
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
  stats: {
    wallet_balance: number;
    this_month: number;
    contributions_count: number;
    outstanding: number;
    target_price: number;
  };
  savings_data: { m: string; v: number }[];
  recent_contributions: { date: string; amount: number; status: string }[];
  [key: string]: unknown;
  subscriptions: Subscription[];
  selected_plan_id: number | null;
}

type Subscription = {
  id: number;
  label: string;
  plan_name: string;
  status: string;
  is_primary: boolean;
  is_completed: boolean;
  total_contributed: number;
  target_price: number;
  progress_pct: number;
};

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(n);

export default function DashboardOverview() {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const user = props.auth?.user;
  const member = props.member;
  const stats = props.stats;
  const savingsData = props.savings_data;
  const recentContributions = props.recent_contributions;
  const { subscriptions, selected_plan_id } = props;

  const switchProject = (id: number) => {
    router.get("/member", { plan: id }, { preserveScroll: true, preserveState: true });
  };

  const firstName = user?.name?.split(" ")[0] ?? t("layout.defaultMemberName");

  const statCards = [
    {
      label: t("member.dashboard.stats.walletBalance"),
      value: formatXAF(stats.wallet_balance),
      icon: Wallet,
      tone: "blue",
      delta: stats.this_month > 0 ? `+${formatXAF(stats.this_month)} this month` : "No contributions this month",
    },
    {
      label: t("member.dashboard.stats.contributionsMade"),
      value: String(stats.contributions_count),
      icon: TrendingUp,
      tone: "gold",
      delta: t("member.dashboard.stats.consecutiveMonths"),
    },
    {
      label: t("member.dashboard.stats.outstanding"),
      value: stats.target_price > 0 ? formatXAF(stats.outstanding) : "—",
      icon: Clock,
      tone: "muted",
      delta: stats.target_price > 0 ? t("member.dashboard.stats.forReservedPlot") : "No active plan",
    },
    {
      label: t("member.dashboard.stats.plotReserved"),
      value: member?.land_type ?? "—",
      icon: Landmark,
      tone: "blue",
      delta: member?.preferred_locations?.length ? member.preferred_locations.join(", ") : "Not specified",
    },
  ];

  const statusLabel = () => {
    if (!member?.status) return t("member.dashboard.propertyStatus.none");
    return t(`member.dashboard.propertyStatus.${member.status === "under_review" ? "underReview" : member.status}`);
  };

  const savingsGrowth = savingsData.length > 0
    ? savingsData.reduce((sum, d) => sum + d.v, 0)
    : 0;

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
                {user?.plan ?? member?.plan ?? t("member.dashboard.noPlanSelected")}
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
              <Link href="/member/contributions">
                <Button variant="gold" size="lg"><Plus className="mr-1 h-4 w-4" /> {t("member.dashboard.makeContribution")}</Button>
              </Link>
              <Button variant="hero" size="lg"><Download className="mr-1 h-4 w-4" /> {t("member.dashboard.statement")}</Button>
            </div>
          </div>
        </div>

        {subscriptions.length > 0 && (
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">My Projects</h3>
              <Link href="/member/plans" className="text-sm font-medium text-rocheli-blue hover:underline">
                Manage all
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => switchProject(s.id)}
                  className={`flex flex-col rounded-2xl border p-4 text-left transition-colors ${
                    s.id === selected_plan_id ? "border-rocheli-blue bg-rocheli-blue/5" : "border-border hover:border-rocheli-blue/40"
                  } ${s.is_completed ? "opacity-70" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{s.label}</span>
                    <div className="flex items-center gap-1">
                      {s.is_primary && <span className="text-[10px] text-rocheli-gold">★</span>}
                      {s.is_completed && <span className="text-[10px] font-medium text-emerald-600">✓ Funded</span>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.plan_name}</span>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${s.is_completed ? "bg-emerald-500" : "bg-gradient-brand"}`}
                      style={{ width: `${s.progress_pct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">{s.progress_pct}% · {formatXAF(s.total_contributed)}</div>
                </button>
              ))}
              <Link
                href="/member/plans"
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground hover:border-rocheli-blue/40"
              >
                + Add project
              </Link>
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
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
                <Badge variant="secondary">{savingsGrowth > 0 ? `+${formatXAF(savingsGrowth)}` : formatXAF(0)}</Badge>
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
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-card)" }} formatter={(v) => formatXAF(Number(v))} />
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
                <h3 className="font-display text-base font-bold">Recent contributions</h3>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {recentContributions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No contributions yet.</p>
                ) : (
                  recentContributions.map((p, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div>
                        <div className="text-sm font-semibold">{p.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{formatXAF(p.amount)}</div>
                        <Badge variant={p.status === "Successful" ? "secondary" : "outline"} className="mt-0.5 text-[10px]">
                          {p.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/member/contributions" className="mt-4 block text-center text-sm font-medium text-rocheli-blue hover:underline">
                View all contributions
              </Link>
            </div>

            <div className="rounded-3xl bg-card p-6 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-bold">{t("member.dashboard.notificationsTitle")}</h3>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}