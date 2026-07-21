import { Head } from "@inertiajs/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Wallet, ArrowUpRight, Share2, Check } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(n);

// --- Dummy data (swap for real Inertia props once backend is wired up) ---
const DUMMY_REFERRAL_CODE = "EMEKA24";
const DUMMY_REFERRAL_LINK = "rocheli.africa/join?ref=EMEKA24";

const DUMMY_STATS = {
  total_referrals: 42,
  active_members: 31,
  pending_commission: 48500,
  paid_commission: 251000,
};

const DUMMY_EARNINGS_HISTORY = [
  { m: "Apr", v: 12000 },
  { m: "May", v: 32000 },
  { m: "Jun", v: 45000 },
  { m: "Jul", v: 28000 },
  { m: "Aug", v: 60000 },
  { m: "Sep", v: 74000 },
];
// ---------------------------------------------------------------------

export default function Referrals() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(DUMMY_REFERRAL_LINK);
      setCopied(true);
      toast.success(t("referrals.linkCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("referrals.copyFailed"));
    }
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("referrals.shareTitle"),
          text: t("referrals.shareText", { code: DUMMY_REFERRAL_CODE }),
          url: DUMMY_REFERRAL_LINK,
        });
      } catch {
        // user cancelled share sheet — no-op
      }
    } else {
      copyLink();
    }
  };

  const statCards = [
    {
      label: t("referrals.stats.totalReferrals"),
      value: String(DUMMY_STATS.total_referrals),
      icon: Users,
    },
    {
      label: t("referrals.stats.activeMembers"),
      value: String(DUMMY_STATS.active_members),
      icon: Users,
    },
    {
      label: t("referrals.stats.pendingCommission"),
      value: formatXAF(DUMMY_STATS.pending_commission),
      icon: Wallet,
    },
    {
      label: t("referrals.stats.paidCommission"),
      value: formatXAF(DUMMY_STATS.paid_commission),
      icon: Wallet,
    },
  ];

  return (
    <>
      <Head title={`${t("referrals.title")} — Rocheli`} />

      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-black md:text-3xl">{t("referrals.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("referrals.subtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
                  <s.icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-display text-2xl font-black">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-gradient-hero p-6 text-white shadow-elegant">
            <Badge className="border-white/20 bg-white/10 text-white">{t("referrals.yourReferral")}</Badge>

            <div className="mt-4 text-xs uppercase tracking-wider text-white/60">{t("referrals.referralCode")}</div>
            <div className="font-display text-3xl font-black text-rocheli-gold">{DUMMY_REFERRAL_CODE}</div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-white/60">{t("referrals.referralLink")}</div>
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm">
                <span className="truncate">{DUMMY_REFERRAL_LINK}</span>
                <button
                  onClick={copyLink}
                  className="ml-auto rounded-md bg-white/10 p-1.5 text-white hover:bg-white/20"
                  aria-label={t("referrals.copyLink")}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <Button variant="gold" className="mt-6 w-full" onClick={shareInvite}>
              <Share2 className="mr-1 h-4 w-4" /> {t("referrals.shareInvite")}
            </Button>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-card lg:col-span-2">
            <h3 className="font-display text-lg font-bold">{t("referrals.earningsHistory")}</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DUMMY_EARNINGS_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="m" fontSize={12} stroke="currentColor" strokeOpacity={0.5} />
                  <YAxis fontSize={12} stroke="currentColor" strokeOpacity={0.5} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-card)" }}
                    formatter={(value) =>
                      value == null ? "" : formatXAF(Number(value))
                    }
                  />
                  <Bar dataKey="v" fill="var(--rocheli-blue)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}