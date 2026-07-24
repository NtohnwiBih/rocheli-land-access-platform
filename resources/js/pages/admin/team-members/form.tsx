import { Head, useForm, Link } from "@inertiajs/react";
import { Save, ArrowLeft, ImageIcon } from "lucide-react";
import { type Locale } from "@/types";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type TeamMemberData = {
  id: number;
  name_en: string;
  name_fr: string;
  position_en: string;
  position_fr: string;
  order: number;
  image: string | null;
} | null;

interface Props {
  member: TeamMemberData;
}

export default function TeamMemberForm({ member }: Props) {
  const editing = !!member;

  const [locale, setLocale] = useState<Locale>("en");
  const [imagePreview, setImagePreview] = useState<string | null>(member?.image ?? null);

  const { data, setData, post, processing, errors, transform } = useForm({
    name_en: member?.name_en ?? "",
    name_fr: member?.name_fr ?? "",
    position_en: member?.position_en ?? "",
    position_fr: member?.position_fr ?? "",
    order: member?.order ?? 0,
    image: null as File | null,
  });

  const handleImage = (file: File | null) => {
    setData("image", file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const submit = () => {
    const options = {
      forceFormData: true as const,
      preserveScroll: true,
    };

    if (editing) {
      transform((d) => ({ ...d, _method: "PUT" }));
      post(`/rocheli/team-members/${member!.id}`, options);
    } else {
      post("/rocheli/team-members", options);
    }
  };

  return (
    <>
      <Head title={editing ? "Edit team member" : "New team member"} />

      <div>
        <AdminPageHeader
          title={editing ? "Edit team member" : "New team member"}
          description="Shown on the About / Team page."
          action={
            <div className="flex items-center gap-3">
              <Link href="/rocheli/team-members">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              </Link>
              <div className="inline-flex rounded-full border border-border bg-muted p-1">
                {(["en", "fr"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase transition ${
                      locale === l ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          }
        />

        <section className="mt-6 border border-border bg-card p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Details</h2>
            <Button
              onClick={submit}
              disabled={processing}
              size="sm"
              className="bg-gradient-blue text-white rounded-full"
            >
              <Save className="h-3.5 w-3.5" />
              {processing ? "Saving…" : editing ? "Update" : "Create"}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4">
              {locale === "en" ? (
                <>
                  <div className="space-y-2">
                    <Label>Name (EN)</Label>
                    <Input value={data.name_en} onChange={(e) => setData("name_en", e.target.value)} />
                    {errors.name_en && <p className="text-xs text-destructive">{errors.name_en}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Position (EN)</Label>
                    <Input value={data.position_en} onChange={(e) => setData("position_en", e.target.value)} />
                    {errors.position_en && <p className="text-xs text-destructive">{errors.position_en}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Name (FR)</Label>
                    <Input value={data.name_fr} onChange={(e) => setData("name_fr", e.target.value)} />
                    {errors.name_fr && <p className="text-xs text-destructive">{errors.name_fr}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Position (FR)</Label>
                    <Input value={data.position_fr} onChange={(e) => setData("position_fr", e.target.value)} />
                    {errors.position_fr && <p className="text-xs text-destructive">{errors.position_fr}</p>}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={data.order}
                  onChange={(e) => setData("order", Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first on the team page.
                </p>
                {errors.order && <p className="text-xs text-destructive">{errors.order}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photo</Label>
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-border">
                  <img src={imagePreview} alt="" className="h-48 w-full object-cover" />
                  <div className="flex items-center justify-between gap-2 border-t border-border bg-card p-2 text-xs">
                    <label className="flex cursor-pointer items-center gap-1 text-muted-foreground hover:text-foreground">
                      <ImageIcon className="h-3.5 w-3.5" /> Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setData("image", null);
                      }}
                      className="text-destructive hover:text-destructive/80"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground transition hover:border-primary hover:bg-muted/50">
                  <ImageIcon className="h-6 w-6" />
                  <span className="font-medium text-foreground">Click to upload photo</span>
                  <span className="text-xs">PNG or JPG — up to 5 MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}