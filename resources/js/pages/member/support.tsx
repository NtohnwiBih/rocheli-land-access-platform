import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle, LifeBuoy } from "lucide-react";

const categoryKeys = ["payments", "property", "account", "documents", "other"] as const;
const categoryValues = ["Payments", "Property", "Account", "Documents", "Other"];

export default function Support() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    category: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (recentlySuccessful) {
      toast.success(t("member.support.successToast"));
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentlySuccessful]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/member/support", {
      preserveScroll: true,
      onError: () => {
        const firstError = Object.values(errors)[0];
        if (firstError) toast.error(firstError as string);
        else toast.error(t("member.support.errorToast"));
      },
    });
  };

  return (
    <>
      <Head title={`${t("member.support.title")} — Rocheli`} />

      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-black md:text-3xl">{t("member.support.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("member.support.subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-6 shadow-card lg:col-span-2">
            <div className="space-y-2">
              <Label>{t("member.support.category")}</Label>
              <Select value={data.category || undefined} onValueChange={(v) => setData("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("member.support.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {categoryKeys.map((key, i) => (
                    <SelectItem key={categoryValues[i]} value={categoryValues[i]}>
                      {t(`member.support.categories.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">{t("member.support.subject")}</Label>
              <Input
                id="subject"
                placeholder={t("member.support.subjectPlaceholder")}
                value={data.subject}
                onChange={(e) => setData("subject", e.target.value)}
              />
              {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t("member.support.message")}</Label>
              <Textarea
                id="message"
                rows={6}
                placeholder={t("member.support.messagePlaceholder")}
                value={data.message}
                onChange={(e) => setData("message", e.target.value)}
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="brand" disabled={processing}>
                {processing ? t("member.support.sending") : t("member.support.send")}
              </Button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-rocheli-blue" />
                <h3 className="font-display text-base font-bold">{t("member.support.otherWays")}</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <a href="mailto:contact@rocheliproperties.com" className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-rocheli-blue/40">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>contact@rocheliproperties.com</span>
                </a>
                <a href="tel:+237000000000" className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-rocheli-blue/40">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+237 6XX XXX XXX</span>
                </a>
                <a href="https://wa.me/2376XXXXXXXX" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-rocheli-blue/40">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{t("member.support.whatsapp")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}