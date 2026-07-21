import { Head, usePage, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { BadgeCheck, ShieldAlert } from "lucide-react";

type MemberStatus = "pending" | "under_review" | "approved" | "rejected";

interface UserData {
  name: string;
  email: string | null;
  phone: string | null;
  gender: "male" | "female" | "other" | null;
  avatar: string | null;
  member_code: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
}

interface MemberData {
  whatsapp: string | null;
  occupation: string | null;
  country_of_residence: string | null;
  city: string | null;
  id_type: string | null;
  id_number: string | null;
  kin_name: string | null;
  kin_relationship: string | null;
  kin_phone: string | null;
  goal: string | null;
  preferred_locations: string[] | null;
  land_type: string | null;
  plan: string | null;
  contribution_frequency: string | null;
  contribution_amount: number | null;
  payment_method: string | null;
  status: MemberStatus;
  submitted_at: string | null;
}

interface PageProps {
  user: UserData;
  member: MemberData | null;
  [key: string]: unknown;
}

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(n);

const statusStyles: Record<MemberStatus, string> = {
  approved: "bg-emerald-500 text-white",
  rejected: "bg-destructive text-destructive-foreground",
  under_review: "bg-rocheli-blue text-white",
  pending: "bg-muted text-muted-foreground",
};

export default function Profile() {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const { user, member } = props;

  const { data, setData, patch, processing, errors, isDirty, recentlySuccessful } = useForm({
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    gender: user.gender ?? "",
    whatsapp: member?.whatsapp ?? "",
    occupation: member?.occupation ?? "",
    country_of_residence: member?.country_of_residence ?? "",
    city: member?.city ?? "",
    kin_name: member?.kin_name ?? "",
    kin_relationship: member?.kin_relationship ?? "",
    kin_phone: member?.kin_phone ?? "",
  });

  useEffect(() => {
    if (recentlySuccessful) toast.success(t("member.profile.successToast"));
  }, [recentlySuccessful, t]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    patch("/member/profile", {
      preserveScroll: true,
      onError: () => {
        const firstError = Object.values(errors)[0];
        if (firstError) toast.error(firstError as string);
      },
    });
  };

  return (
    <>
      <Head title={`${t("member.profile.title")} — Rocheli`} />

      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-black md:text-3xl">{t("member.profile.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("member.profile.subtitle")}</p>
        </div>

        {/* Identity header */}
        <div className="flex flex-wrap items-center gap-5 rounded-3xl bg-card p-6 shadow-card">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar ?? undefined} />
            <AvatarFallback className="text-lg">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-bold">{user.name}</h2>
              {member?.status && (
                <Badge className={statusStyles[member.status]}>{t(`member.profile.statuses.${member.status}`)}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {user.member_code ? `Member ID: ${user.member_code}` : t("member.profile.memberIdFallback")}
              {member?.plan && ` · ${member.plan}`}
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
              {user.email_verified ? (
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              )}
              {user.email_verified ? t("member.profile.emailVerified") : t("member.profile.emailUnverified")}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
              {user.phone_verified ? (
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              )}
              {user.phone_verified ? t("member.profile.phoneVerified") : t("member.profile.phoneUnverified")}
            </span>
          </div>
        </div>

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Personal info */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-bold">{t("member.profile.personalInfo.title")}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">{t("member.profile.personalInfo.fullName")}</Label>
                  <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("member.profile.personalInfo.email")}</Label>
                  <Input id="email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("member.profile.personalInfo.phone")}</Label>
                  <Input id="phone" value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">{t("member.profile.personalInfo.whatsapp")}</Label>
                  <Input id="whatsapp" value={data.whatsapp} onChange={(e) => setData("whatsapp", e.target.value)} />
                  {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("member.profile.personalInfo.gender")}</Label>
                  <Select value={data.gender || undefined} onValueChange={(v) => setData("gender", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("member.profile.personalInfo.genderPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("member.profile.personalInfo.genderMale")}</SelectItem>
                      <SelectItem value="female">{t("member.profile.personalInfo.genderFemale")}</SelectItem>
                      <SelectItem value="other">{t("member.profile.personalInfo.genderOther")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">{t("member.profile.personalInfo.occupation")}</Label>
                  <Input id="occupation" value={data.occupation} onChange={(e) => setData("occupation", e.target.value)} />
                  {errors.occupation && <p className="text-xs text-destructive">{errors.occupation}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t("member.profile.personalInfo.country")}</Label>
                  <Input
                    id="country"
                    value={data.country_of_residence}
                    onChange={(e) => setData("country_of_residence", e.target.value)}
                  />
                  {errors.country_of_residence && (
                    <p className="text-xs text-destructive">{errors.country_of_residence}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{t("member.profile.personalInfo.city")}</Label>
                  <Input id="city" value={data.city} onChange={(e) => setData("city", e.target.value)} />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* Next of kin */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-bold">{t("member.profile.kin.title")}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="kin_name">{t("member.profile.kin.fullName")}</Label>
                  <Input id="kin_name" value={data.kin_name} onChange={(e) => setData("kin_name", e.target.value)} />
                  {errors.kin_name && <p className="text-xs text-destructive">{errors.kin_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kin_relationship">{t("member.profile.kin.relationship")}</Label>
                  <Input
                    id="kin_relationship"
                    value={data.kin_relationship}
                    onChange={(e) => setData("kin_relationship", e.target.value)}
                  />
                  {errors.kin_relationship && <p className="text-xs text-destructive">{errors.kin_relationship}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="kin_phone">{t("member.profile.kin.phone")}</Label>
                  <Input id="kin_phone" value={data.kin_phone} onChange={(e) => setData("kin_phone", e.target.value)} />
                  {errors.kin_phone && <p className="text-xs text-destructive">{errors.kin_phone}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="brand" disabled={processing || !isDirty}>
                {processing ? t("member.profile.saving") : t("member.profile.save")}
              </Button>
            </div>
          </div>

          {/* Read-only membership + KYC info */}
          <div className="space-y-6">
            {member && (
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h3 className="font-display text-base font-bold">{t("member.profile.membership.title")}</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">{t("member.profile.membership.plan")}</dt>
                    <dd className="font-medium">{member.plan ?? "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">{t("member.profile.membership.contribution")}</dt>
                    <dd className="font-medium">
                      {member.contribution_amount != null
                        ? `${formatXAF(member.contribution_amount)} / ${member.contribution_frequency?.toLowerCase() ?? "period"}`
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">{t("member.profile.membership.paymentMethod")}</dt>
                    <dd className="font-medium">{member.payment_method ?? "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">{t("member.profile.membership.landType")}</dt>
                    <dd className="font-medium">{member.land_type ?? "—"}</dd>
                  </div>
                </dl>
              </div>
            )}

            {member && (member.id_type || member.id_number) && (
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h3 className="font-display text-base font-bold">{t("member.profile.identification.title")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t("member.profile.identification.note")}</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">{t("member.profile.identification.idType")}</dt>
                    <dd className="font-medium">{member.id_type ?? "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">{t("member.profile.identification.idNumber")}</dt>
                    <dd className="font-medium">{member.id_number ?? "—"}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}