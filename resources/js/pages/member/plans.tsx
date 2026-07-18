import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/custom-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, MapPin, Landmark, Star, CheckCircle2, ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";

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
  status: "pending" | "under_review" | "approved" | "rejected";
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

const FREQUENCIES = ["Daily", "Weekly", "Monthly"];
const PAYMENT_METHODS = ["MTN Mobile Money", "Orange Money", "Bank Transfer", "Cash Deposit"];
const LAND_TYPES = ["Land", "Residential", "Commercial", "Agricultural", "Undecided"];
const GOALS = ["Build a home", "Invest in land", "Buy for family", "Business project", "Other"];

const statusColor: Record<Subscription["status"], string> = {
  approved: "bg-emerald-500 text-white",
  rejected: "bg-destructive text-destructive-foreground",
  under_review: "bg-rocheli-blue text-white",
  pending: "bg-muted text-muted-foreground",
};

export default function PlansPage() {
  const { t, i18n } = useTranslation();
  const { props } = usePage<PageProps>();
  const { subscriptions, available_plans, cities } = props;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const wizardSteps = ["Plan", "Details", "Contribution"];
  const pct = ((step + 1) / wizardSteps.length) * 100;

  const CITIES = cities.map((c) => ({
    key: c.key,
    label: i18n.language === "fr" ? c.name_fr : c.name_en,
  }));

  const { data, setData, post, processing, errors, reset } = useForm({
    plan_id: null as number | null,
    label: "",
    goal: "",
    preferred_locations: [] as string[],
    land_type: "",
    contribution_frequency: "",
    contribution_amount: "",
    payment_method: "",
  });

  const selectedPlan = available_plans.find((p) => p.id === data.plan_id);

  const planAmountForFrequency = (plan: PlanData | undefined, frequency: string): number | null => {
    if (!plan) return null;
    if (frequency === "Daily") return plan.daily_amount;
    if (frequency === "Weekly") return plan.weekly_amount;
    if (frequency === "Monthly") return plan.monthly_amount;
    return null;
  };

  const expectedAmount = planAmountForFrequency(selectedPlan, data.contribution_frequency);

  useEffect(() => {
    if (expectedAmount !== null) {
      setData("contribution_amount", String(expectedAmount));
    }
  }, [data.plan_id, data.contribution_frequency]);

  const toggleLocation = (loc: string, checked: boolean) => {
    setData(
      "preferred_locations",
      checked
        ? [...data.preferred_locations, loc]
        : data.preferred_locations.filter((l) => l !== loc)
    );
  };

  const validateStep = (currentStep: number): Record<string, string> => {
    const errs: Record<string, string> = {};

    if (currentStep === 0) {
      if (!data.plan_id) errs.plan_id = "Please select a plan.";
    }

    if (currentStep === 1) {
      if (!data.goal) errs.goal = "Please select a goal.";
      if (!data.land_type) errs.land_type = "Please select a land type.";
    }

    if (currentStep === 2) {
      if (!data.contribution_frequency) errs.contribution_frequency = "Please select a frequency.";
      if (!data.contribution_amount) {
        errs.contribution_amount = "Amount is required.";
      } else {
        const amountNum = Number(data.contribution_amount);
        if (amountNum <= 0) {
          errs.contribution_amount = "Enter a valid amount.";
        } else if (expectedAmount !== null) {
          if (selectedPlan?.is_flexible) {
            if (amountNum < expectedAmount) {
              errs.contribution_amount = `Minimum is ${formatXAF(expectedAmount)}.`;
            }
          } else if (amountNum !== expectedAmount) {
            errs.contribution_amount = `This plan requires exactly ${formatXAF(expectedAmount)}.`;
          }
        }
      }
      if (!data.payment_method) errs.payment_method = "Please select a payment method.";
    }

    return errs;
  };

  const goNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setClientErrors(stepErrors);
      return;
    }
    setClientErrors({});
    setStep((s) => Math.min(wizardSteps.length - 1, s + 1));
  };

  const goBack = () => {
    setClientErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const showError = (field: string) => clientErrors[field] || (errors as Record<string, string>)[field];

  const closeDialog = () => {
    setOpen(false);
    setStep(0);
    setClientErrors({});
    reset();
  };

  const submit = () => {
    const stepErrors = validateStep(2);
    if (Object.keys(stepErrors).length > 0) {
      setClientErrors(stepErrors);
      return;
    }

    post("/member/plans", {
      preserveScroll: true,
      onSuccess: () => closeDialog(),
    });
  };

  return (
    <>
      <Head title={`${t("plans.title")} — Rocheli`} />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black md:text-3xl">{t("plans.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("plans.subtitle")}</p>
          </div>

          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) closeDialog(); }}>
            <DialogTrigger asChild>
              <Button variant="brand">
                <Plus className="mr-1 h-4 w-4" /> {t("plans.addProject")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("plans.newProjectTitle")}</DialogTitle>
                <DialogDescription>{t("plans.newProjectDesc")}</DialogDescription>

                <div className="mt-2">
                  <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>Step {step + 1} of {wizardSteps.length}</span>
                    <span>{wizardSteps[step]}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-gradient-brand transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <ol className="mt-3 flex gap-2">
                    {wizardSteps.map((s, i) => (
                      <li
                        key={s}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          i <= step ? "bg-rocheli-blue/10 text-rocheli-blue" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i < step && <CheckCircle2 className="h-3 w-3" />} {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </DialogHeader>

              <DialogBody>
                <div className="min-h-0 flex-1 overflow-y-auto px-6">
                  <div className="space-y-4 py-4">
                    {step === 0 && (
                      <>
                        <div className="space-y-2">
                          <Label>{t("plans.labelField")}</Label>
                          <Input
                            placeholder={t("plans.labelPlaceholder")}
                            value={data.label}
                            onChange={(e) => setData("label", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Plan</Label>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {available_plans.map((p) => (
                              <label
                                key={p.id}
                                className={`relative flex cursor-pointer flex-col rounded-xl border p-3 text-sm transition-colors hover:border-rocheli-blue ${
                                  data.plan_id === p.id ? "border-rocheli-gold bg-rocheli-gold/5" : "border-border"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="plan_id"
                                  className="sr-only"
                                  checked={data.plan_id === p.id}
                                  onChange={() => setData("plan_id", p.id)}
                                />
                                <span className="font-semibold">{p.name}</span>
                                <span className="text-xs text-muted-foreground">{formatXAF(p.target_price)}</span>
                              </label>
                            ))}
                          </div>
                          {showError("plan_id") && <p className="text-xs text-destructive">{showError("plan_id")}</p>}
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <div className="space-y-2">
                          <Label>{t("plans.chooseGoal")}</Label>
                          <RadioGroup value={data.goal} onValueChange={(v) => setData("goal", v)} className="grid gap-2 sm:grid-cols-2">
                            {GOALS.map((g) => (
                              <label key={g} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm hover:border-rocheli-blue">
                                <RadioGroupItem value={g} /> {g}
                              </label>
                            ))}
                          </RadioGroup>
                          {showError("goal") && <p className="text-xs text-destructive">{showError("goal")}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>{t("plans.chooseLocations")}</Label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {CITIES.map((c) => (
                              <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm hover:border-rocheli-blue">
                                <Checkbox
                                  checked={data.preferred_locations.includes(c.label)}
                                  onCheckedChange={(checked) => toggleLocation(c.label, Boolean(checked))}
                                />
                                {c.label}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>{t("plans.chooseLandType")}</Label>
                          <RadioGroup value={data.land_type} onValueChange={(v) => setData("land_type", v)} className="grid gap-2 sm:grid-cols-3">
                            {LAND_TYPES.map((lt) => (
                              <label key={lt} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm hover:border-rocheli-blue">
                                <RadioGroupItem value={lt} /> {lt}
                              </label>
                            ))}
                          </RadioGroup>
                          {showError("land_type") && <p className="text-xs text-destructive">{showError("land_type")}</p>}
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="space-y-2">
                          <Label>{t("plans.chooseFrequency")}</Label>
                          <div className="flex flex-wrap gap-2">
                            {FREQUENCIES.map((f) => (
                              <button
                                type="button"
                                key={f}
                                onClick={() => setData("contribution_frequency", f)}
                                className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
                                  data.contribution_frequency === f
                                    ? "border-rocheli-gold bg-rocheli-gold text-rocheli-navy"
                                    : "border-border hover:border-rocheli-gold/60"
                                }`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                          {showError("contribution_frequency") && <p className="text-xs text-destructive">{showError("contribution_frequency")}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>{t("plans.chooseAmount")}</Label>
                          <Input
                            type="number"
                            value={data.contribution_amount}
                            min={expectedAmount ?? undefined}
                            readOnly={selectedPlan ? !selectedPlan.is_flexible : false}
                            onChange={(e) => setData("contribution_amount", e.target.value)}
                          />
                          {showError("contribution_amount") && <p className="text-xs text-destructive">{showError("contribution_amount")}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>{t("plans.choosePaymentMethod")}</Label>
                          <RadioGroup value={data.payment_method} onValueChange={(v) => setData("payment_method", v)} className="grid gap-2 sm:grid-cols-2">
                            {PAYMENT_METHODS.map((m) => (
                              <label key={m} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm hover:border-rocheli-blue">
                                <RadioGroupItem value={m} /> {m}
                              </label>
                            ))}
                          </RadioGroup>
                          {showError("payment_method") && <p className="text-xs text-destructive">{showError("payment_method")}</p>}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </DialogBody>

              <DialogFooter className="sm:justify-between">
                <Button
                  variant="ghost"
                  onClick={step === 0 ? closeDialog : goBack}
                  disabled={processing}
                >
                  {step === 0 ? (
                    t("plans.cancel")
                  ) : (
                    <>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </>
                  )}
                </Button>
                {step < wizardSteps.length - 1 ? (
                  <Button variant="brand" onClick={goNext}>
                    Continue <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="brand" onClick={submit} disabled={processing}>
                    {processing ? t("plans.submitting") : t("plans.submitProject")}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {subscriptions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <Landmark className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">{t("plans.noProjects")}</p>
            <Button variant="brand" className="mt-4" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> {t("plans.startFirst")}
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {subscriptions.map((s) => (
              <div key={s.id} className={`flex flex-col rounded-3xl bg-card p-6 shadow-card ${s.is_completed ? "opacity-90" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-lg font-bold">{s.label}</span>
                      {s.is_primary && <Star className="h-3.5 w-3.5 fill-rocheli-gold text-rocheli-gold" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{s.plan_name}</span>
                  </div>
                  <Badge className={s.is_completed ? "bg-emerald-600 text-white" : statusColor[s.status]}>
                    {s.is_completed ? (
                      <span className="flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Fully funded</span>
                    ) : s.status === "under_review" ? (
                      "Under review"
                    ) : (
                      s.status.charAt(0).toUpperCase() + s.status.slice(1)
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
                      className={`h-full rounded-full ${s.is_completed ? "bg-emerald-500" : "bg-gradient-brand"}`}
                      style={{ width: `${s.progress_pct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {s.is_completed
                      ? `Completed ${s.completed_at}`
                      : t("plans.contributedOf", { contributed: formatXAF(s.total_contributed), target: formatXAF(s.target_price) })}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div>{t("plans.payingLabel", { amount: formatXAF(s.contribution_amount), frequency: s.contribution_frequency.toLowerCase() })}</div>
                  <div className="mt-0.5">{t("plans.subscribedOn", { date: s.subscribed_at })}</div>
                </div>

                <a href={`/member/contributions?project=${s.id}`} className="mt-4 text-sm font-medium text-rocheli-blue hover:underline">
                  {t("plans.viewContributions")}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}