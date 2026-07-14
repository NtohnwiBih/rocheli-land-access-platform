import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ArrowLeft, ArrowRight, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AuthNavLayout } from "@/layouts/auth/auth-nav-layout";

const steps = [
  "Personal Information",
  "Identity Verification",
  "Preferences",
  "Contribution Plan",
  "Review & Submit",
];

type MemberForm = {
  // Step 1 — Personal (goes to users table)
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  gender: string;
  occupation: string;
  country_of_residence: string;
  city: string;
  password: string;
  password_confirmation: string;

  // Step 2 — Identity verification
  id_type: string;
  id_number: string;
  id_document: File | null;

  // Step 3 — Preferences
  goal: string;
  preferred_locations: string[];
  land_type: string;
  kin_name: string;
  kin_relationship: string;
  kin_phone: string;

  // Step 4 — Contribution
  plan: string;
  contribution_frequency: string;
  contribution_amount: string;
  payment_method: string;

  // Step 5 — Confirmation
  agreements: boolean[];
  signature: string;
};

const PLANS = [
  {
    name: "Starter Plan",
    price: "2,000,000 FCFA",
    daily: "2,500 F",
    weekly: "15,000 F",
    monthly: "65,000 F",
  },
  {
    name: "Growth Plan",
    price: "3,000,000 FCFA",
    daily: "5,000 F",
    weekly: "25,000 F",
    monthly: "100,000 F",
  },
  {
    name: "Advance Plan",
    price: "5,000,000 FCFA",
    daily: "10,000 F",
    weekly: "50,000 F",
    monthly: "175,000 F",
    featured: true,
  },
  {
    name: "Prime Plan",
    price: "10,000,000 FCFA",
    daily: "10,000+ F",
    weekly: "75,000+ F",
    monthly: "300,000+ F",
  },
];

const AGREEMENT_LABELS = [
  "I understand that the Land Access Club is a land acquisition program operated by Rocheli Real Properties.",
  "Choosing a plan does not immediately allocate a specific plot.",
  "Plot allocation becomes available once eligibility is met.",
  "I accept the Membership Agreement and Withdrawal Policy.",
];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
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
    password: "",
    password_confirmation: "",
    id_type: "",
    id_number: "",
    id_document: null,
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

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

//   const submit: FormEventHandler = (e) => {
//     e.preventDefault();
//     post("/register", { forceFormData: true });
//   };

  return (
    <div className="min-h-screen bg-muted/40">
      <Head title="Become a Member — Rocheli" />
      <AuthNavLayout />
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <Badge variant="secondary" className="mb-3">Onboarding</Badge>
        <h1 className="font-display text-3xl font-black md:text-4xl">Join the Land Access Club</h1>
        <p className="mt-2 text-sm text-muted-foreground">Takes about 5 minutes.</p>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Step {step + 1} of {steps.length}</span>
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

        <form className="mt-8 rounded-3xl bg-card p-6 shadow-card md:p-10">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Full name</Label>
                <Input className="mt-1.5" value={data.full_name} onChange={(e) => setData("full_name", e.target.value)} />
                {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name}</p>}
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" className="mt-1.5" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>

              <div>
                <Label>Gender</Label>
                <Select value={data.gender} onValueChange={(v) => setData("gender", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="mt-1 text-xs text-destructive">{errors.gender}</p>}
              </div>

              <div>
                <Label>Phone</Label>
                <Input placeholder="+237 6XX XXX XXX" className="mt-1.5" value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div>
                <Label>WhatsApp number</Label>
                <Input placeholder="+237 6XX XXX XXX" className="mt-1.5" value={data.whatsapp} onChange={(e) => setData("whatsapp", e.target.value)} />
                {errors.whatsapp && <p className="mt-1 text-xs text-destructive">{errors.whatsapp}</p>}
              </div>

              <div>
                <Label>Occupation</Label>
                <Input className="mt-1.5" value={data.occupation} onChange={(e) => setData("occupation", e.target.value)} />
              </div>

              <div>
                <Label>Country of residence</Label>
                <Input className="mt-1.5" value={data.country_of_residence} onChange={(e) => setData("country_of_residence", e.target.value)} />
              </div>

              <div className="sm:col-span-2">
                <Label>City</Label>
                <Select value={data.city} onValueChange={(v) => setData("city", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {["Yaoundé", "Douala", "Buea", "Limbe", "Bamenda", "Bafoussam", "Kribi"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative mt-1.5">
                    <Input
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
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
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
              </div>

              <div>
                <Label>Confirm password</Label>
                <div className="relative mt-1.5">
                    <Input
                    type={showPasswordConfirmation ? "text" : "password"}
                    className="pr-10"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
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
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4">
              <div>
                <Label>ID type</Label>
                <Select value={data.id_type} onValueChange={(v) => setData("id_type", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NIN">NIN</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="Driver's License">Driver's License</SelectItem>
                  </SelectContent>
                </Select>
                {errors.id_type && <p className="mt-1 text-xs text-destructive">{errors.id_type}</p>}
              </div>

              <div>
                <Label>ID number</Label>
                <Input className="mt-1.5" value={data.id_number} onChange={(e) => setData("id_number", e.target.value)} />
                {errors.id_number && <p className="mt-1 text-xs text-destructive">{errors.id_number}</p>}
              </div>

              <div>
                <Label>Upload ID document (PNG/JPG/PDF, max 5MB)</Label>
                <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground hover:border-rocheli-blue">
                  {data.id_document ? data.id_document.name : "Click to upload"}
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    onChange={(e) => setData("id_document", e.target.files?.[0] ?? null)}
                  />
                </label>
                {errors.id_document && <p className="mt-1 text-xs text-destructive">{errors.id_document}</p>}
              </div>

              <div className="mt-4 rounded-2xl border border-border p-5">
                <p className="text-sm font-semibold">Next of kin (optional)</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Input placeholder="Full name" value={data.kin_name} onChange={(e) => setData("kin_name", e.target.value)} />
                  <Select
                    value={data.kin_relationship || undefined}
                    onValueChange={(v) => setData("kin_relationship", v)}
                   >
                    <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>

                    <SelectContent>
                        {["Spouse", "Child", "Parent", "Sibling", "Friend", "Other"].map((c) => (
                        <SelectItem key={c} value={c}>
                            {c}
                        </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Phone" value={data.kin_phone} onChange={(e) => setData("kin_phone", e.target.value)} />
                </div>
                {errors.kin_phone && <p className="mt-1 text-xs text-destructive">{errors.kin_phone}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5">
              <div>
                <Label>Why are you joining?</Label>
                <RadioGroup value={data.goal} onValueChange={(v) => setData("goal", v)} className="mt-2 grid gap-2 sm:grid-cols-2">
                  {["Build a home", "Invest in land", "Buy for family", "Business project", "Other"].map((g) => (
                    <label key={g} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 hover:border-rocheli-blue">
                      <RadioGroupItem value={g} /> {g}
                    </label>
                  ))}
                </RadioGroup>
                {errors.goal && <p className="mt-1 text-xs text-destructive">{errors.goal}</p>}
              </div>

              <div>
                <Label>Preferred location(s)</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {["Yaoundé", "Douala", "Buea", "Limbe", "Bamenda", "Bafoussam", "Kribi", "Other"].map((loc) => (
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
                <Label>Land type</Label>
                <RadioGroup value={data.land_type} onValueChange={(v) => setData("land_type", v)} className="mt-2 grid gap-2 sm:grid-cols-3">
                  {["Land", "Residential", "Commercial", "Agricultural", "Undecided"].map((t) => (
                    <label key={t} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 hover:border-rocheli-blue">
                      <RadioGroupItem value={t} /> {t}
                    </label>
                  ))}
                </RadioGroup>
                {errors.land_type && <p className="mt-1 text-xs text-destructive">{errors.land_type}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {PLANS.map((p) => (
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
                    onChange={() => setData("plan", p.name)}
                    />

                    <span
                    className={`absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                        data.plan === p.name ? "border-rocheli-gold" : "border-border"
                    }`}
                    >
                    {data.plan === p.name && (
                        <span className="h-2.5 w-2.5 rounded-full bg-rocheli-gold" />
                    )}
                    </span>

                    <div className="flex items-center justify-between pr-8">
                    <span className="font-display font-bold">{p.name}</span>
                    {p.featured && <Badge className="bg-rocheli-gold text-rocheli-navy">Popular</Badge>}
                    </div>

                    <div className="mt-2 text-sm text-muted-foreground">
                    Target: <span className="font-semibold text-foreground">{p.price}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                    <div>
                        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Daily</div>
                        <div className="text-sm font-semibold">{p.daily}</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Weekly</div>
                        <div className="text-sm font-semibold">{p.weekly}</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Monthly</div>
                        <div className="text-sm font-semibold">{p.monthly}</div>
                    </div>
                    </div>
                </label>
                ))}
              </div>
              {errors.plan && <p className="text-xs text-destructive">{errors.plan}</p>}

              <div>
                <Label>Contribution frequency</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Daily", "Weekly", "Monthly"].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setData("contribution_frequency", f)}
                      className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition ${
                        data.contribution_frequency === f
                          ? "border-rocheli-gold bg-rocheli-gold text-rocheli-navy"
                          : "border-border hover:border-rocheli-gold/60"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                {errors.contribution_frequency && <p className="mt-1 text-xs text-destructive">{errors.contribution_frequency}</p>}
              </div>

              <div>
                <Label>Amount (FCFA)</Label>
                <Input
                  type="number"
                  className="mt-1.5"
                  value={data.contribution_amount}
                  onChange={(e) => setData("contribution_amount", e.target.value)}
                />
                {errors.contribution_amount && <p className="mt-1 text-xs text-destructive">{errors.contribution_amount}</p>}
              </div>

              <div>
                <Label>Payment method</Label>
                <RadioGroup value={data.payment_method} onValueChange={(v) => setData("payment_method", v)} className="mt-2 grid gap-2 sm:grid-cols-2">
                  {["MTN Mobile Money", "Orange Money", "Bank Transfer", "Cash Deposit"].map((m) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 hover:border-rocheli-blue">
                      <RadioGroupItem value={m} /> {m}
                    </label>
                  ))}
                </RadioGroup>
                {errors.payment_method && <p className="mt-1 text-xs text-destructive">{errors.payment_method}</p>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-sm">
              <div className="rounded-2xl bg-muted p-5">
                <div className="font-display font-bold">You're all set!</div>
                <p className="mt-2 text-muted-foreground">Confirm the details below and submit to activate your membership.</p>
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
                {errors.agreements && <p className="text-xs text-destructive">{errors.agreements}</p>}
              </div>

              <div>
                <Label>Digital signature — full name</Label>
                <Input
                  className="mt-1.5 font-display italic"
                  value={data.signature}
                  onChange={(e) => setData("signature", e.target.value)}
                />
                {errors.signature && <p className="mt-1 text-xs text-destructive">{errors.signature}</p>}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button type="button" variant="ghost" disabled={step === 0} onClick={back}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" variant="brand" onClick={next}>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" variant="gold" disabled={processing}>
                {processing ? "Submitting…" : "Submit & continue"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}