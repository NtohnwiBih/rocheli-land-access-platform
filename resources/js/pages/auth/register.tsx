import { Head, router, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ArrowLeft, ArrowRight, EyeOff, Eye, MailCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AuthNavLayout } from "@/layouts/auth/auth-nav-layout";

type MemberForm = {
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  gender: string;
  occupation: string;
  country_of_residence: string;
  city: string;
  preferred_locale: string;
  password: string;
  password_confirmation: string;

  id_type: string;
  id_number: string;
  id_document: File | null;
  id_document_back: File | null;

  goal: string;
  preferred_locations: string[];
  land_type: string;
  kin_name: string;
  kin_relationship: string;
  kin_phone: string;

  plan: string;
  contribution_frequency: string;
  contribution_amount: string;
  payment_method: string;

  agreements: boolean[];
  signature: string;
};

type ClientErrors = Partial<Record<keyof MemberForm, string>>;

type PlanData = {
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

interface RegisterPageProps {
  plans: PlanData[];
  cities: CityData[];
  registered?: boolean;
}

type FlashProps = {
  flash?: { registered?: boolean };
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)/;


export default function RegisterPage({ plans, cities, registered = false }: RegisterPageProps) {
  const { t, i18n } = useTranslation();
  const { props } = usePage<FlashProps>();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (registered) {
      setShowSuccessDialog(true);
    }
  }, [registered]);

  const goToDashboard = () => {
    router.visit("/member");
  };

  const steps = [
    t("register.steps.0"), t("register.steps.1"), t("register.steps.2"), t("register.steps.3"), t("register.steps.4"),
  ];
  const pct = ((step + 1) / steps.length) * 100;

  const { data, setData, post, processing, errors } = useForm<MemberForm>({
    full_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    gender: "",
    occupation: "",
    country_of_residence: "",
    city: "",
    preferred_locale: i18n.language === "fr" ? "fr" : "en",
    password: "",
    password_confirmation: "",
    id_type: "",
    id_number: "",
    id_document: null,
    id_document_back: null,
    goal: "",
    preferred_locations: [],
    land_type: "",
    kin_name: "",
    kin_relationship: "",
    kin_phone: "",
    plan: "",
    contribution_frequency: "",
    contribution_amount: "",
    payment_method: "",
    agreements: [false, false, false, false],
    signature: "",
  });

  const formatXAF = (n: number) =>
    new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(n);

  const CITIES = cities.map((c) => ({
    key: c.key,
    label: i18n.language === "fr" ? c.name_fr : c.name_en,
  }));

  const requiresBackUpload = data.id_type === "NIN" || data.id_type === "Driver's License";

  useEffect(() => {
    if (!requiresBackUpload && data.id_document_back) {
      setField("id_document_back", null);
    }
  }, [data.id_type]);

  const selectedPlan = plans.find((p) => p.name === data.plan);

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
      setField("contribution_amount", String(expectedAmount));
    }
  }, [data.plan, data.contribution_frequency]);

  const GOALS = [
    t("register.step3.goalBuildHome"), t("register.step3.goalInvest"), t("register.step3.goalFamily"),
    t("register.step3.goalBusiness"), t("register.step3.goalOther"),
  ];

  const LAND_TYPES = [
    t("register.step3.landTypeLand"), t("register.step3.landTypeResidential"), t("register.step3.landTypeCommercial"),
    t("register.step3.landTypeAgricultural"), t("register.step3.landTypeUndecided"),
  ];

  const KIN_RELATIONSHIPS = [
    t("register.step2.kinRelationshipSpouse"), t("register.step2.kinRelationshipChild"), t("register.step2.kinRelationshipParent"),
    t("register.step2.kinRelationshipSibling"), t("register.step2.kinRelationshipFriend"), t("register.step2.kinRelationshipOther"),
  ];

  const PAYMENT_METHODS = [
    t("register.step4.paymentMomo"), t("register.step4.paymentOrange"), t("register.step4.paymentBank"), t("register.step4.paymentCash"),
  ];

  const FREQUENCIES = [
    { key: "Daily", label: t("register.step4.frequencyDaily") },
    { key: "Weekly", label: t("register.step4.frequencyWeekly") },
    { key: "Monthly", label: t("register.step4.frequencyMonthly") },
  ];

  const AGREEMENT_LABELS = [
    t("register.step5.agreements.0"), t("register.step5.agreements.1"), t("register.step5.agreements.2"), t("register.step5.agreements.3"),
  ];

  const toggleLocation = (loc: string, checked: boolean) => {
    setData(
      "preferred_locations",
      checked
        ? [...data.preferred_locations, loc]
        : data.preferred_locations.filter((l) => l !== loc)
    );
  };

  const toggleAgreement = (i: number, checked: boolean) => {
    const next = [...data.agreements];
    next[i] = checked;
    setData("agreements", next);
  };

  const setField = <K extends keyof MemberForm>(field: K, value: MemberForm[K]) => {
    // cast to any to satisfy useForm's setData overloaded typing (e.g. File | null cases)
    setData(field as any, value as any);
    if (clientErrors[field]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // --- Validation ---------------------------------------------------------

  const validateStep = (currentStep: number): ClientErrors => {
    const errs: ClientErrors = {};

    if (currentStep === 0) {
      if (!data.full_name.trim()) {
        errs.full_name = t("register.errors.fullNameRequired");
      }
      if (!data.email.trim()) {
        errs.email = t("register.errors.emailRequired");
      } else if (!EMAIL_PATTERN.test(data.email)) {
        errs.email = t("register.errors.emailInvalid");
      }
      if (!data.gender) {
        errs.gender = t("register.errors.genderRequired");
      }
      if (!data.phone.trim()) {
        errs.phone = t("register.errors.phoneRequired");
      }
      if (!data.city) {
        errs.city = t("register.errors.cityRequired");
      }
      if (!data.password) {
        errs.password = t("register.errors.passwordRequired");
      } else if (data.password.length < 8) {
        errs.password = t("register.errors.passwordTooShort");
      } else if (!PASSWORD_PATTERN.test(data.password)) {
        errs.password = t("register.errors.passwordPattern");
      }
      if (!data.password_confirmation) {
        errs.password_confirmation = t("register.errors.confirmPasswordRequired");
      } else if (data.password_confirmation !== data.password) {
        errs.password_confirmation = t("register.errors.passwordMismatch");
      }
    }

    if (currentStep === 1) {
      if (!data.id_type) {
        errs.id_type = t("register.errors.idTypeRequired");
      }
      if (!data.id_number.trim()) {
        errs.id_number = t("register.errors.idNumberRequired");
      }
      if (!data.id_document) {
        errs.id_document = t("register.errors.idDocumentRequired");
      }
      if ((data.id_type === "NIN" || data.id_type === "Driver's License") && !data.id_document_back) {
        errs.id_document_back = t("register.errors.idDocumentBackRequired");
      }
    }

    if (currentStep === 2) {
      if (!data.goal) {
        errs.goal = t("register.errors.goalRequired");
      }
      if (!data.land_type) {
        errs.land_type = t("register.errors.landTypeRequired");
      }
    }

    if (currentStep === 3) {
      if (!data.plan) {
        errs.plan = t("register.errors.planRequired");
      }
      if (!data.contribution_frequency) {
        errs.contribution_frequency = t("register.errors.frequencyRequired");
      }
      if (!data.contribution_amount) {
        errs.contribution_amount = t("register.errors.amountRequired");
      } else {
        const amountNum = Number(data.contribution_amount);
        if (amountNum <= 0) {
          errs.contribution_amount = t("register.errors.amountInvalid");
        } else if (expectedAmount !== null) {
          if (selectedPlan?.is_flexible) {
            if (amountNum < expectedAmount) {
              errs.contribution_amount = t("register.errors.amountBelowMinimum", { min: formatXAF(expectedAmount) });
            }
          } else if (amountNum !== expectedAmount) {
            errs.contribution_amount = t("register.errors.amountMismatch", { expected: formatXAF(expectedAmount) });
          }
        }
      }
      if (!data.payment_method) {
        errs.payment_method = t("register.errors.paymentMethodRequired");
      }
    }

    if (currentStep === 4) {
      if (data.agreements.some((a) => !a)) {
        errs.agreements = t("register.errors.agreementsRequired");
      }
      if (!data.signature.trim()) {
        errs.signature = t("register.errors.signatureRequired");
      }
    }

    return errs;
  };

  const frequencyLabel = FREQUENCIES.find((f) => f.key === data.contribution_frequency)?.label.toLowerCase()
  ?? t("register.step4.frequencyPeriod");

  const next = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setClientErrors(stepErrors);
      return;
    }
    setClientErrors({});
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const back = () => {
    setClientErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const showError = (field: keyof MemberForm) => clientErrors[field] || errors[field];

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    const stepErrors = validateStep(4);
    if (Object.keys(stepErrors).length > 0) {
      setClientErrors(stepErrors);
      return;
    }

    setClientErrors({});
    post("/register", { forceFormData: true });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <Head title="Become a Member — Rocheli" />
      <AuthNavLayout />
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <Badge variant="secondary" className="mb-3">{t("register.badge")}</Badge>
        <h1 className="font-display text-3xl font-black md:text-4xl">{t("register.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("register.subtitle")}</p>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>{t("register.stepLabel", { current: step + 1, total: steps.length })}</span>
            <span>{steps[step]}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-gradient-brand transition-all" style={{ width: `${pct}%` }} />
          </div>
          <ol className="mt-4 hidden flex-wrap gap-2 md:flex">
            {steps.map((s, i) => (
              <li key={s} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${i <= step ? "bg-rocheli-blue/10 text-rocheli-blue" : "bg-muted text-muted-foreground"}`}>
                {i < step && <CheckCircle2 className="h-3.5 w-3.5" />} {s}
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={submit} className="mt-8 rounded-3xl bg-card p-6 shadow-card md:p-10" noValidate>
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>{t("register.step1.fullName")}</Label>
                <Input className="mt-1.5" value={data.full_name} onChange={(e) => setField("full_name", e.target.value)} />
                {showError("full_name") && <p className="mt-1 text-xs text-destructive">{showError("full_name")}</p>}
              </div>

              <div>
                <Label>{t("register.step1.email")}</Label>
                <Input type="email" className="mt-1.5" value={data.email} onChange={(e) => setField("email", e.target.value)} />
                {showError("email") && <p className="mt-1 text-xs text-destructive">{showError("email")}</p>}
              </div>

              <div>
                <Label>{t("register.step1.gender")}</Label>
                <Select value={data.gender} onValueChange={(v) => setField("gender", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("register.step1.genderPlaceholder")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("register.step1.genderMale")}</SelectItem>
                    <SelectItem value="female">{t("register.step1.genderFemale")}</SelectItem>
                    <SelectItem value="other">{t("register.step1.genderOther")}</SelectItem>
                  </SelectContent>
                </Select>
                {showError("gender") && <p className="mt-1 text-xs text-destructive">{showError("gender")}</p>}
              </div>

              <div>
                <Label>{t("register.step1.phone")}</Label>
                <Input placeholder={t("register.step1.phonePlaceholder")} className="mt-1.5" value={data.phone} onChange={(e) => setField("phone", e.target.value)} />
                {showError("phone") && <p className="mt-1 text-xs text-destructive">{showError("phone")}</p>}
              </div>

              <div>
                <Label>{t("register.step1.whatsapp")}</Label>
                <Input placeholder={t("register.step1.phonePlaceholder")} className="mt-1.5" value={data.whatsapp} onChange={(e) => setField("whatsapp", e.target.value)} />
                {showError("whatsapp") && <p className="mt-1 text-xs text-destructive">{showError("whatsapp")}</p>}
              </div>

              <div>
                <Label>{t("register.step1.occupation")}</Label>
                <Input className="mt-1.5" value={data.occupation} onChange={(e) => setField("occupation", e.target.value)} />
              </div>

              <div>
                <Label>{t("register.step1.country")}</Label>
                <Input className="mt-1.5" value={data.country_of_residence} onChange={(e) => setField("country_of_residence", e.target.value)} />
              </div>

              <div className="sm:col-span-2">
                <Label>{t("register.step1.city")}</Label>
                <Select value={data.city} onValueChange={(v) => setField("city", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("register.step1.cityPlaceholder")} /></SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c.key} value={c.label}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showError("city") && <p className="mt-1 text-xs text-destructive">{showError("city")}</p>}
              </div>

              <div className="sm:col-span-2">
                <Label>{t("register.step1.preferredLanguage")}</Label>
                <Select value={data.preferred_locale} onValueChange={(v) => setField("preferred_locale", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("register.step1.preferredLanguageHint")}
                </p>
              </div>

              <div>
                <Label>{t("register.step1.password")}</Label>
                <div className="relative mt-1.5">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    value={data.password}
                    onChange={(e) => setField("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {showError("password") && <p className="mt-1 text-xs text-destructive">{showError("password")}</p>}
              </div>

              <div>
                <Label>{t("register.step1.confirmPassword")}</Label>
                <div className="relative mt-1.5">
                  <Input
                    type={showPasswordConfirmation ? "text" : "password"}
                    className="pr-10"
                    value={data.password_confirmation}
                    onChange={(e) => setField("password_confirmation", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {showError("password_confirmation") && <p className="mt-1 text-xs text-destructive">{showError("password_confirmation")}</p>}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4">
              <div>
                <Label>{t("register.step2.idType")}</Label>
                <Select value={data.id_type} onValueChange={(v) => setField("id_type", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("register.step2.idTypePlaceholder")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NIN">{t("register.step2.idTypeNin")}</SelectItem>
                    <SelectItem value="Passport">{t("register.step2.idTypePassport")}</SelectItem>
                    <SelectItem value="Driver's License">{t("register.step2.idTypeLicense")}</SelectItem>
                  </SelectContent>
                </Select>
                {showError("id_type") && <p className="mt-1 text-xs text-destructive">{showError("id_type")}</p>}
              </div>

              <div>
                <Label>{t("register.step2.idNumber")}</Label>
                <Input className="mt-1.5" value={data.id_number} onChange={(e) => setField("id_number", e.target.value)} />
                {showError("id_number") && <p className="mt-1 text-xs text-destructive">{showError("id_number")}</p>}
              </div>

              <div className={requiresBackUpload ? "grid gap-4 sm:grid-cols-2" : ""}>
                <div>
                  <Label>
                    {requiresBackUpload
                      ? t("register.step2.uploadFrontLabel")
                      : t("register.step2.uploadLabel")}
                  </Label>
                  <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground hover:border-rocheli-blue">
                    {data.id_document ? data.id_document.name : t("register.step2.uploadPrompt")}
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => setField("id_document", e.target.files?.[0] ?? null)}
                    />
                  </label>
                  {showError("id_document") && <p className="mt-1 text-xs text-destructive">{showError("id_document")}</p>}
                </div>

                {requiresBackUpload && (
                  <div>
                    <Label>{t("register.step2.uploadBackLabel")}</Label>
                    <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground hover:border-rocheli-blue">
                      {data.id_document_back ? data.id_document_back.name : t("register.step2.uploadPrompt")}
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        className="hidden"
                        onChange={(e) => setField("id_document_back", e.target.files?.[0] ?? null)}
                      />
                    </label>
                    {showError("id_document_back") && <p className="mt-1 text-xs text-destructive">{showError("id_document_back")}</p>}
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-border p-5">
                <p className="text-sm font-semibold">{t("register.step2.kinTitle")}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Input placeholder={t("register.step2.kinName")} value={data.kin_name} onChange={(e) => setField("kin_name", e.target.value)} />
                  <Select
                    value={data.kin_relationship || undefined}
                    onValueChange={(v) => setField("kin_relationship", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("register.step2.kinRelationship")} />
                    </SelectTrigger>
                    <SelectContent>
                      {KIN_RELATIONSHIPS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input placeholder={t("register.step2.kinPhone")} value={data.kin_phone} onChange={(e) => setField("kin_phone", e.target.value)} />
                </div>
                {showError("kin_phone") && <p className="mt-1 text-xs text-destructive">{showError("kin_phone")}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5">
              <div>
                <Label>{t("register.step3.goalLabel")}</Label>
                <RadioGroup value={data.goal} onValueChange={(v) => setField("goal", v)} className="mt-2 grid gap-2 sm:grid-cols-2">
                  {GOALS.map((g) => (
                    <label key={g} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 hover:border-rocheli-blue">
                      <RadioGroupItem value={g} /> {g}
                    </label>
                  ))}
                </RadioGroup>
                {showError("goal") && <p className="mt-1 text-xs text-destructive">{showError("goal")}</p>}
              </div>

              <div>
                <Label>{t("register.step3.locationsLabel")}</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[...CITIES.map((c) => c.label), t("register.step3.locationOther")].map((loc) => (
                    <label key={loc} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 hover:border-rocheli-blue">
                      <Checkbox
                        checked={data.preferred_locations.includes(loc)}
                        onCheckedChange={(c) => toggleLocation(loc, Boolean(c))}
                      />
                      {loc}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>{t("register.step3.landTypeLabel")}</Label>
                <RadioGroup value={data.land_type} onValueChange={(v) => setField("land_type", v)} className="mt-2 grid gap-2 sm:grid-cols-3">
                  {LAND_TYPES.map((tItem) => (
                    <label key={tItem} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 hover:border-rocheli-blue">
                      <RadioGroupItem value={tItem} /> {tItem}
                    </label>
                  ))}
                </RadioGroup>
                {showError("land_type") && <p className="mt-1 text-xs text-destructive">{showError("land_type")}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {plans.map((p) => (
                  <label
                    key={p.name}
                    className={`relative flex cursor-pointer flex-col rounded-2xl border p-5 transition-colors hover:border-rocheli-blue ${
                      data.plan === p.name ? "border-rocheli-gold bg-rocheli-gold/5" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      className="sr-only"
                      checked={data.plan === p.name}
                      onChange={() => setField("plan", p.name)}
                    />
                    <span
                      className={`absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                        data.plan === p.name ? "border-rocheli-gold" : "border-border"
                      }`}
                    >
                      {data.plan === p.name && <span className="h-2.5 w-2.5 rounded-full bg-rocheli-gold" />}
                    </span>

                    <div className="flex items-center justify-between pr-8">
                      <span className="font-display font-bold">{p.name}</span>
                      {p.is_featured && <Badge className="bg-rocheli-gold text-rocheli-navy">{t("register.step4.planPopular")}</Badge>}
                    </div>

                    <div className="mt-2 text-sm text-muted-foreground">
                      {t("register.step4.planTarget")} <span className="font-semibold text-foreground">{formatXAF(p.target_price)}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("register.step4.planDaily")}</div>
                        <div className="text-sm font-semibold">
                          {formatXAF(p.daily_amount)}{p.is_flexible && "+"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("register.step4.planWeekly")}</div>
                        <div className="text-sm font-semibold">
                          {formatXAF(p.weekly_amount)}{p.is_flexible && "+"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t("register.step4.planMonthly")}</div>
                        <div className="text-sm font-semibold">
                          {formatXAF(p.monthly_amount)}{p.is_flexible && "+"}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {showError("plan") && <p className="text-xs text-destructive">{showError("plan")}</p>}

              <div>
                <Label>{t("register.step4.frequencyLabel")}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      type="button"
                      key={f.key}
                      onClick={() => setField("contribution_frequency", f.key)}
                      className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition ${
                        data.contribution_frequency === f.key
                          ? "border-rocheli-gold bg-rocheli-gold text-rocheli-navy"
                          : "border-border hover:border-rocheli-gold/60"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                {showError("contribution_frequency") && <p className="mt-1 text-xs text-destructive">{showError("contribution_frequency")}</p>}
              </div>

              <div>
                <Label>{t("register.step4.amountLabel")}</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={data.contribution_amount}
                  min={expectedAmount ?? undefined}
                  readOnly={selectedPlan ? !selectedPlan.is_flexible : false}
                  onChange={(e) => setField("contribution_amount", e.target.value)}
                />
                {selectedPlan && !selectedPlan.is_flexible && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("register.step4.amountFixedNote", {
                      amount: formatXAF(expectedAmount ?? 0),
                      frequency: frequencyLabel,
                    })}
                  </p>
                )}
                {selectedPlan?.is_flexible && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("register.step4.amountMinimumNote", {
                      amount: formatXAF(expectedAmount ?? 0),
                      frequency: frequencyLabel,
                    })}
                  </p>
                )}
                {showError("contribution_amount") && <p className="mt-1 text-xs text-destructive">{showError("contribution_amount")}</p>}
              </div>

              <div>
                <Label>{t("register.step4.paymentLabel")}</Label>
                <RadioGroup value={data.payment_method} onValueChange={(v) => setField("payment_method", v)} className="mt-2 grid gap-2 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 hover:border-rocheli-blue">
                      <RadioGroupItem value={m} /> {m}
                    </label>
                  ))}
                </RadioGroup>
                {showError("payment_method") && <p className="mt-1 text-xs text-destructive">{showError("payment_method")}</p>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-sm">
              <div className="rounded-2xl bg-muted p-5">
                <div className="font-display font-bold">{t("register.step5.readyTitle")}</div>
                <p className="mt-2 text-muted-foreground">{t("register.step5.readyDesc")}</p>
              </div>

              <div className="space-y-2">
                {AGREEMENT_LABELS.map((label, i) => (
                  <label key={i} className="flex items-start gap-3 rounded-xl border border-border p-4 hover:border-rocheli-blue/60">
                    <Checkbox
                      checked={data.agreements[i]}
                      onCheckedChange={(c) => toggleAgreement(i, Boolean(c))}
                      className="mt-0.5"
                    />
                    <span>{label}</span>
                  </label>
                ))}
                {showError("agreements") && <p className="text-xs text-destructive">{showError("agreements")}</p>}
              </div>

              <div>
                <Label>{t("register.step5.signature")}</Label>
                <Input
                  className="mt-1.5 font-display italic"
                  value={data.signature}
                  onChange={(e) => setField("signature", e.target.value)}
                />
                {showError("signature") && <p className="mt-1 text-xs text-destructive">{showError("signature")}</p>}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button type="button" variant="ghost" disabled={step === 0} onClick={back}>
              <ArrowLeft className="mr-1 h-4 w-4" /> {t("register.back")}
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" variant="brand" onClick={next}>
                {t("register.continue")} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" variant="gold" disabled={processing}>
                {processing ? t("register.submitting") : t("register.submit")}
              </Button>
            )}
          </div>
        </form>
      </div>
      <Dialog open={showSuccessDialog} onOpenChange={(open) => !open && goToDashboard()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rocheli-blue/10">
              <MailCheck className="h-6 w-6 text-rocheli-blue" />
            </div>
            <DialogTitle className="text-center">
              {t("register.success.title")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t("register.success.checkEmail")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button variant="brand" onClick={goToDashboard}>
              {t("register.success.gotIt")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}