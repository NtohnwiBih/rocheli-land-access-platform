import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Ruler, TrendingUp, RotateCcw } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface PageProps {
  plan: {
    name: string | null;
    target_price: number;
  };
  contribution: {
    frequency: string | null;
    amount: number;
  };
  progress: {
    total_contributed: number;
    remaining: number;
    payments_remaining: number;
    years_remaining: number;
    payments_per_year: number;
  };
  appreciation_rate: number;
  price_per_sqm: number;
  suggested_locations: string[];
  [key: string]: unknown;
}

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(n);

export default function CalculatorPage() {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const { plan, contribution, progress, appreciation_rate, price_per_sqm, suggested_locations } = props;

  const hasRealPlan = plan.target_price > 0 && contribution.amount > 0 && contribution.frequency;

  const [monthly, setMonthly] = useState(
    hasRealPlan
      ? Math.round(
          contribution.amount *
            (contribution.frequency === "Daily" ? 30 : contribution.frequency === "Weekly" ? 4.33 : 1)
        )
      : 75000
  );
  const [years, setYears] = useState(hasRealPlan ? Math.max(progress.years_remaining, 1) : 3);
  const [overriding, setOverriding] = useState(false);

  const resetToActual = () => {
    if (!hasRealPlan) return;
    setMonthly(
      Math.round(
        contribution.amount *
          (contribution.frequency === "Daily" ? 30 : contribution.frequency === "Weekly" ? 4.33 : 1)
      )
    );
    setYears(Math.max(progress.years_remaining, 1));
    setOverriding(false);
  };

  const total = monthly * years * 12;
  const future = Math.round(total * Math.pow(1 + appreciation_rate, years));
  const size = Math.round(total / price_per_sqm);

  const data = Array.from({ length: years * 12 + 1 }).map((_, i) => ({
    m: i,
    saved: monthly * i,
    value: Math.round(monthly * i * Math.pow(1 + appreciation_rate / 12, i)),
  }));

  const findMatchingPlots = () => {
    router.get("/member/property", { max_size: size });
  };

  const yearSuffix = (n: number) => (n === 1 ? t("calculator.yearSuffix_one") : t("calculator.yearSuffix_other"));

  return (
    <>
      <Head title={`${t("calculator.title")} — Rocheli`} />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black md:text-3xl">{t("calculator.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("calculator.subtitle")}</p>
          </div>
          {hasRealPlan && (
            <Badge variant={overriding ? "outline" : "secondary"} className={overriding ? "" : "bg-rocheli-blue/10 text-rocheli-blue"}>
              {overriding ? t("calculator.exploringScenario") : t("calculator.syncedWith", { plan: plan.name })}
            </Badge>
          )}
        </div>

        {hasRealPlan && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("calculator.planTarget")}</div>
                <div className="mt-1 font-display text-lg font-bold">{formatXAF(plan.target_price)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("calculator.contributedSoFar")}</div>
                <div className="mt-1 font-display text-lg font-bold">{formatXAF(progress.total_contributed)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("calculator.paying")}</div>
                <div className="mt-1 font-display text-lg font-bold">
                  {formatXAF(contribution.amount)} / {contribution.frequency?.toLowerCase()}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("calculator.estTimeToCompletion")}</div>
                <div className="mt-1 font-display text-lg font-bold">
                  {progress.years_remaining > 0
                    ? `${progress.years_remaining} ${yearSuffix(progress.years_remaining)}`
                    : t("calculator.complete")}
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasRealPlan && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            {t("calculator.noPlanNotice")}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-card p-6 shadow-card lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">{t("calculator.scenario")}</Label>
              {hasRealPlan && overriding && (
                <Button variant="ghost" size="sm" onClick={resetToActual} className="h-7 gap-1 px-2 text-xs">
                  <RotateCcw className="h-3 w-3" /> {t("calculator.resetToMyPlan")}
                </Button>
              )}
            </div>
            <div>
              <Label>{t("calculator.monthlyEquivalent")}</Label>
              <Input
                type="number"
                value={monthly}
                onChange={(e) => {
                  setMonthly(Number(e.target.value) || 0);
                  setOverriding(true);
                }}
                className="mt-1.5"
              />
              <Slider
                className="mt-4"
                min={25000}
                max={300000}
                step={5000}
                value={[monthly]}
                onValueChange={([v]) => {
                  setMonthly(v);
                  setOverriding(true);
                }}
              />
            </div>
            <div>
              <Label>{t("calculator.duration", { years })}</Label>
              <Slider
                className="mt-4"
                min={1}
                max={10}
                step={1}
                value={[years]}
                onValueChange={([v]) => {
                  setYears(v);
                  setOverriding(true);
                }}
              />
            </div>
            <div className="rounded-2xl bg-gradient-hero p-5 text-white">
              <Sparkles className="h-5 w-5 text-rocheli-gold" />
              <div className="mt-2 text-xs uppercase tracking-wider text-white/60">{t("calculator.projectedFutureValue")}</div>
              <div className="mt-1 font-display text-3xl font-black">{formatXAF(future)}</div>
            </div>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-card lg:col-span-2">
            <div className="mb-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-muted p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("calculator.projectedSavings")}</div>
                <div className="mt-1 font-display text-xl font-black">{formatXAF(total)}</div>
              </div>
              <div className="rounded-2xl bg-muted p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("calculator.estimatedLandSize")}</div>
                <div className="mt-1 flex items-center gap-1 font-display text-xl font-black"><Ruler className="h-4 w-4 text-rocheli-blue" /> {size} {t("calculator.sqm")}</div>
              </div>
              <div className="rounded-2xl bg-muted p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("calculator.growthEst")}</div>
                <div className="mt-1 flex items-center gap-1 font-display text-xl font-black"><TrendingUp className="h-4 w-4 text-emerald-500" /> {(appreciation_rate * 100).toFixed(0)}{t("calculator.perYear")}</div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="m" fontSize={12} stroke="currentColor" strokeOpacity={0.5} />
                  <YAxis fontSize={12} stroke="currentColor" strokeOpacity={0.5} tickFormatter={(v: number) => `${(v / 1e6).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} formatter={(v) => formatXAF(Number(v))} />
                  <Line type="monotone" dataKey="saved" stroke="var(--rocheli-blue)" strokeWidth={2.5} dot={false} name={t("calculator.savedLegend")} />
                  <Line type="monotone" dataKey="value" stroke="var(--rocheli-gold)" strokeWidth={2.5} dot={false} name={t("calculator.projectedValueLegend")} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6">
              <div className="mb-2 text-sm font-semibold">{t("calculator.suggestedLocations")}</div>
              <div className="flex flex-wrap gap-2">
                {suggested_locations.length > 0 ? (
                  suggested_locations.map((l) => (
                    <Badge key={l} variant="outline"><MapPin className="mr-1 h-3 w-3" /> {l}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">{t("calculator.noLocationsAvailable")}</span>
                )}
              </div>
              <Button variant="brand" className="mt-6" onClick={findMatchingPlots}>
                {t("calculator.findMatchingPlots")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}