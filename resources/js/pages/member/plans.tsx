import { usePage, router, Head } from "@inertiajs/react";
import { useEcho } from '@laravel/echo-react';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm } from "@inertiajs/react";
import { Plus, MapPin, Landmark, Star, BadgeCheck, PauseCircle } from "lucide-react";
import { AddProjectDialog } from "@/components/member/AddProjectDialog";

type Subscription = {
  id: number;
  label: string;
  plan_name: string;
  target_price: number;
  total_contributed: number;
  progress_pct: number;
  contribution_frequency: string;
  contribution_amount: number;
  goal: string;
  land_type: string;
  status: "active" | "inactive" | "completed" | "suspended";
  is_primary: boolean;
  is_completed: boolean;
  completed_at: string | null;
  subscribed_at: string;
};

type PlanData = {
  id: number;
  name: string;
  target_price: number;
  daily_amount: number;
  weekly_amount: number;
  monthly_amount: number;
  is_flexible: boolean;
  is_featured: boolean;
};

type CityData = {
  key: string;
  name_en: string;
  name_fr: string;
};

interface PageProps {
  subscriptions: Subscription[];
  available_plans: PlanData[];
  cities: CityData[];
  [key: string]: unknown;
}

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(n);

const statusColor: Record<Subscription["status"], string> = {
  active: "bg-emerald-500 text-white",
  completed: "bg-emerald-600 text-white",
  inactive: "bg-amber-500 text-white",
  suspended: "bg-muted text-muted-foreground",
};

const statusLabel: Record<Subscription["status"], string> = {
  active: "Active",
  completed: "Fully funded",
  inactive: "Inactive",
  suspended: "Suspended",
};

export default function PlansPage() {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const { available_plans, cities } = props;

  // Local state so a realtime update can patch the list without a full reload
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(props.subscriptions);

  useEffect(() => {
    setSubscriptions(props.subscriptions);
  }, [props.subscriptions]);

  const memberId = (props as any).auth?.user?.member?.id as number | undefined;

  useEcho(
    memberId ? `member.${memberId}` : '',
    '.ContributionStatusUpdated',
    () => {
      // A contribution's status changed — plan totals/progress may have
      // shifted (e.g. approval increases total_contributed), so refresh
      // just the subscriptions prop rather than the whole page.
      router.reload({ only: ['subscriptions'] });
    },
    [memberId],
    'private',
  );

  // Members can hold at most 5 active/inactive projects at once. If they're at
  // the cap, offer inline suspension of an inactive project instead of the wizard.
  const activeOrInactiveCount = subscriptions.filter(
    (s) => s.status === "active" || s.status === "inactive"
  ).length;
  const atCap = activeOrInactiveCount >= 5;
  const inactiveSubs = subscriptions.filter((s) => s.status === "inactive");

  const { post: postSuspend, processing: suspending } = useForm({});
  const suspendPlan = (id: number) => postSuspend(`/member/plans/${id}/suspend`, { preserveScroll: true });

  return (
    <>
      <Head title={`${t("plans.title")} — Rocheli`} />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black md:text-3xl">{t("plans.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("plans.subtitle")}</p>
          </div>

          <AddProjectDialog
            availablePlans={available_plans}
            cities={cities}
            atCap={atCap}
            inactiveSubs={inactiveSubs}
            onSuspend={suspendPlan}
            suspending={suspending}
          />
        </div>

        {subscriptions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <Landmark className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">{t("plans.noProjects")}</p>
            <AddProjectDialog
              availablePlans={available_plans}
              cities={cities}
              atCap={atCap}
              inactiveSubs={inactiveSubs}
              onSuspend={suspendPlan}
              suspending={suspending}
              trigger={
                <Button variant="brand" className="mt-4">
                  <Plus className="mr-1 h-4 w-4" /> {t("plans.startFirst")}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {subscriptions.map((s) => (
              <div key={s.id} className={`flex flex-col rounded-3xl bg-card p-6 shadow-card ${s.status === "completed" || s.status === "suspended" ? "opacity-90" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-lg font-bold">{s.label}</span>
                      {s.is_primary && <Star className="h-3.5 w-3.5 fill-rocheli-gold text-rocheli-gold" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{s.plan_name}</span>
                  </div>
                  <Badge className={statusColor[s.status]}>
                    {s.status === "completed" ? (
                      <span className="flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Fully funded</span>
                    ) : (
                      statusLabel[s.status]
                    )}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-rocheli-blue" /> {s.land_type} · {s.goal}
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                    <span>{t("plans.progressLabel", { pct: s.progress_pct })}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${s.status === "completed" ? "bg-emerald-500" : "bg-gradient-brand"}`}
                      style={{ width: `${s.progress_pct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {s.status === "completed"
                      ? `Completed ${s.completed_at}`
                      : t("plans.contributedOf", { contributed: formatXAF(s.total_contributed), target: formatXAF(s.target_price) })}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div>{t("plans.payingLabel", { amount: formatXAF(s.contribution_amount), frequency: s.contribution_frequency.toLowerCase() })}</div>
                  <div className="mt-0.5">{t("plans.subscribedOn", { date: s.subscribed_at })}</div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <a href={`/member/contributions?project=${s.id}`} className="text-sm font-medium text-rocheli-blue hover:underline">
                    {t("plans.viewContributions")}
                  </a>

                  {s.status === "inactive" && (
                    <button
                      type="button"
                      disabled={suspending}
                      onClick={() => suspendPlan(s.id)}
                      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
                    >
                      <PauseCircle className="h-3.5 w-3.5" /> Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}