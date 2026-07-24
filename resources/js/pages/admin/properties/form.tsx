import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import { Save, ChevronRight, ArrowLeft, ImageIcon, Upload, Trash2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Locale } from "@/types";

type MediaItem = { id: number; type: "image" | "video"; src: string; caption: string | null; is_featured: boolean };

type PropertyData = {
  id: number;
  slug: string;
  title_en: string;
  title_fr: string;
  city_id: number;
  location: string;
  size: string;
  type: string;
  category_id: number;
  price: string;
  price_value: number | null;
  status: string;
  description_en: string;
  description_fr: string;
  image: string | null;
  media: MediaItem[];
} | null;

type CategoryOption = { id: number; name_en: string };
type CityOption = { id: number; name_en: string; name_fr: string };

interface Props {
  property: PropertyData;
  categories: CategoryOption[];
  cities: CityOption[];
}

const sections = [
  { key: "details", label: "Details" },
  { key: "pricing", label: "Pricing & Status" },
  { key: "media", label: "Media" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

export default function PropertyForm({ property, categories, cities }: Props) {
  const editing = !!property;
  const [activeSection, setActiveSection] = useState<SectionKey>("details");
  const [locale, setLocale] = useState<Locale>("en");
  const [imagePreview, setImagePreview] = useState<string | null>(property?.image ?? null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  const { data, setData, post, processing, errors, transform } = useForm({
    slug: property?.slug ?? "",
    title_en: property?.title_en ?? "",
    title_fr: property?.title_fr ?? "",
    city_id: property?.city_id ?? null,
    location: property?.location ?? "",
    size: property?.size ?? "",
    type: property?.type ?? "",
    category_id: property?.category_id ?? null,
    price: property?.price ?? "",
    price_value: property?.price_value ?? "",
    status: property?.status ?? "Available",
    description_en: property?.description_en ?? "",
    description_fr: property?.description_fr ?? "",
    image: null as File | null,
  });

  const submit = () => {
    const options = { forceFormData: true as const, preserveScroll: true };
    if (editing) {
      transform((d) => ({ ...d, _method: "PUT" }));
      post(`/rocheli/properties/${property!.id}`, options);
    } else {
      post("/rocheli/properties", options);
    }
  };

  const uploadGallery = () => {
    if (!galleryFiles || !property) return;
    const formData = new FormData();
    Array.from(galleryFiles).forEach((f) => formData.append("files[]", f));
    router.post(`/rocheli/properties/${property.id}/media`, formData, { preserveScroll: true });
    setGalleryFiles(null);
  };

  const removeMedia = (mediaId: number) => {
    if (!property || !confirm("Remove this media item?")) return;
    router.delete(`/rocheli/properties/${property.id}/media/${mediaId}`, { preserveScroll: true });
  };

  const currentSection = sections.find((s) => s.key === activeSection);

  return (
    <>
      <Head title={editing ? "Edit property" : "New property"} />

      <div>
        <AdminPageHeader
          title={editing ? "Edit property" : "New property"}
          description="Listing shown on the public site and to members, with bilingual title and description."
          action={
            <div className="flex items-center gap-3">
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
              <Link href="/rocheli/properties">
                <Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button>
              </Link>
            </div>
          }
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] items-start">
          <nav className="border border-border bg-card p-2 lg:sticky lg:top-4">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-sm font-semibold">Sections</h3>
              <span className="text-xs text-muted-foreground">{sections.length} total</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {sections.map((section) => {
                const isActive = section.key === activeSection;
                return (
                  <div key={section.key} className="group flex items-center gap-1 rounded-lg hover:bg-muted/60">
                    <button
                      onClick={() => setActiveSection(section.key)}
                      className={`flex flex-1 items-center gap-1.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                        isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <ChevronRight
                        className={`h-3.5 w-3.5 shrink-0 transition-opacity ${
                          isActive ? "opacity-100" : "opacity-40 group-hover:opacity-60"
                        }`}
                      />
                      <span className="truncate">{section.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </nav>

          {currentSection && (
            <section className="border border-border bg-card p-6 md:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">{currentSection.label}</h2>
                <Button onClick={submit} disabled={processing} size="sm" className="bg-gradient-blue text-white rounded-full">
                  <Save className="h-3.5 w-3.5" /> {processing ? "Saving…" : editing ? "Update" : "Create"}
                </Button>
              </div>

              {activeSection === "details" && (
                <div className="grid gap-4 sm:grid-cols-2">
                    {editing && (
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Slug</Label>
                        <Input
                          value={data.slug}
                          onChange={(e) => setData("slug", e.target.value)}
                          placeholder="auto-generated-from-title"
                        />
                        <p className="text-xs text-muted-foreground">
                          Changing this will change the property's public URL. Leave as-is unless you have a specific reason to update it.
                        </p>
                        {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                      </div>
                    )}
                  {locale === "en" ? (
                    <>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Title (EN)</Label>
                        <Input value={data.title_en} onChange={(e) => setData("title_en", e.target.value)} />
                        {errors.title_en && <p className="text-xs text-destructive">{errors.title_en}</p>}
                      </div>
                      <div className="sm:col-span-2" />
                      <div className="sm:col-span-2 space-y-2">
                        <Label>Description (EN)</Label>
                        <Textarea rows={4} value={data.description_en} onChange={(e) => setData("description_en", e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Title (FR)</Label>
                        <Input value={data.title_fr} onChange={(e) => setData("title_fr", e.target.value)} />
                        {errors.title_fr && <p className="text-xs text-destructive">{errors.title_fr}</p>}
                      </div>
                      <div className="sm:col-span-2" />
                      <div className="sm:col-span-2 space-y-2">
                        <Label>Description (FR)</Label>
                        <Textarea rows={4} value={data.description_fr} onChange={(e) => setData("description_fr", e.target.value)} />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>City</Label>
                    <Select value={data.city_id ? String(data.city_id) : undefined} onValueChange={(v) => setData("city_id", Number(v))}>
                      <SelectTrigger><SelectValue placeholder="Select a city" /></SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name_en}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.city_id && <p className="text-xs text-destructive">{errors.city_id}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={data.location} onChange={(e) => setData("location", e.target.value)} />
                    {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={data.category_id ? String(data.category_id) : undefined} onValueChange={(v) => setData("category_id", Number(v))}>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name_en}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.category_id && <p className="text-xs text-destructive">{errors.category_id}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Type (e.g. Plot, Duplex)</Label>
                    <Input value={data.type} onChange={(e) => setData("type", e.target.value)} />
                    {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Input value={data.size} onChange={(e) => setData("size", e.target.value)} placeholder="500 sqm" />
                    {errors.size && <p className="text-xs text-destructive">{errors.size}</p>}
                  </div>
                </div>
              )}

              {activeSection === "pricing" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Display price</Label>
                    <Input value={data.price} onChange={(e) => setData("price", e.target.value)} placeholder="FCFA 24.9M" />
                    {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Numeric price (for sorting/filtering)</Label>
                    <Input type="number" value={data.price_value} onChange={(e) => setData("price_value", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={data.status} onValueChange={(v) => setData("status", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Selling Fast">Selling Fast</SelectItem>
                        <SelectItem value="Reserved">Reserved</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {activeSection === "media" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Primary image</Label>
                    {imagePreview ? (
                      <div className="relative overflow-hidden rounded-xl border border-border">
                        <img src={imagePreview} alt="" className="h-40 w-full object-cover" />
                        <label className="absolute bottom-2 right-2 flex cursor-pointer items-center gap-1 rounded-lg bg-card px-2 py-1 text-xs shadow-card">
                          <ImageIcon className="h-3.5 w-3.5" /> Replace
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setData("image", f);
                            if (f) setImagePreview(URL.createObjectURL(f));
                          }} />
                        </label>
                      </div>
                    ) : (
                      <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground hover:border-primary">
                        <Upload className="h-6 w-6" />
                        <span className="font-medium text-foreground">Click to upload primary image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setData("image", f);
                          if (f) setImagePreview(URL.createObjectURL(f));
                        }} />
                      </label>
                    )}
                  </div>

                  {editing ? (
                    <div className="space-y-3">
                      <Label>Gallery (additional images/videos)</Label>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {property!.media.map((m) => (
                          <div key={m.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                            {m.type === "image" ? (
                              <img src={m.src} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <video src={m.src} className="h-full w-full object-cover" />
                            )}
                            {m.is_featured && <Star className="absolute left-1 top-1 h-3.5 w-3.5 fill-rocheli-gold text-rocheli-gold" />}
                            <button
                              onClick={() => removeMedia(m.id)}
                              className="absolute right-1 top-1 hidden rounded bg-black/60 p-1 text-white group-hover:block"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="file" multiple accept="image/*,video/*" onChange={(e) => setGalleryFiles(e.target.files)} />
                        <Button variant="outline" onClick={uploadGallery} disabled={!galleryFiles}>Upload</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Save the property first to add gallery images and videos.</p>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}