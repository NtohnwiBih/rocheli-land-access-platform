import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/custom-dialog";

type Testimonial = {
  id: number;
  name: string;
  role_en: string;
  role_fr: string;
  quote_en: string;
  quote_fr: string;
  rating: number;
  avatar: string | null;
  sort_order: number;
  is_published: boolean;
};

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialsIndex({ testimonials }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const { data, setData, post, processing, errors, reset, transform } = useForm({
    name: "",
    role_en: "",
    role_fr: "",
    quote_en: "",
    quote_fr: "",
    rating: 5,
    sort_order: 0,
    is_published: true,
    avatar: null as File | null,
    _method: "POST" as "POST" | "PUT",
  });

  const openCreate = () => {
    setEditing(null);
    reset();
    setOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setData({
      name: t.name,
      role_en: t.role_en,
      role_fr: t.role_fr,
      quote_en: t.quote_en,
      quote_fr: t.quote_fr,
      rating: t.rating,
      sort_order: t.sort_order,
      is_published: t.is_published,
      avatar: null,
      _method: "PUT",
    });
    setOpen(true);
  };

  const submit = () => {
    const url = editing ? `/rocheli/testimonials/${editing.id}` : "/rocheli/testimonials";
    transform((d) => ({ ...d, _method: editing ? "PUT" : "POST" }));
    post(url, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const destroy = (id: number) => {
    if (!confirm("Remove this testimonial?")) return;
    router.delete(`/rocheli/testimonials/${id}`, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Testimonials" />
      <div className="space-y-6">
        <AdminPageHeader
          title="Testimonials"
          description="Manage member stories shown on the homepage."
          action={
            <Button onClick={openCreate} size="sm" className="bg-gradient-blue text-white rounded-full">
              <Plus className="h-3.5 w-3.5" /> Add testimonial
            </Button>
          }
        />

        <AdminTable headers={["Name", "Quote (EN)", "Rating", "Status", ""]}>
          {testimonials.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell className="max-w-sm truncate text-muted-foreground">{t.quote_en}</TableCell>
              <TableCell>
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={t.is_published ? "secondary" : "outline"}>
                  {t.is_published ? "Published" : "Hidden"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(t)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => destroy(t.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </AdminTable>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="min-h-0 flex-1 overflow-y-auto px-6">
              <div className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={data.name} onChange={(e) => setData("name", e.target.value)} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Rating (1–5)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={data.rating}
                      onChange={(e) => setData("rating", Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Role (EN)</Label>
                    <Input value={data.role_en} onChange={(e) => setData("role_en", e.target.value)} />
                    {errors.role_en && <p className="text-xs text-destructive">{errors.role_en}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Role (FR)</Label>
                    <Input value={data.role_fr} onChange={(e) => setData("role_fr", e.target.value)} />
                    {errors.role_fr && <p className="text-xs text-destructive">{errors.role_fr}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quote (EN)</Label>
                  <Textarea rows={3} value={data.quote_en} onChange={(e) => setData("quote_en", e.target.value)} />
                  {errors.quote_en && <p className="text-xs text-destructive">{errors.quote_en}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Quote (FR)</Label>
                  <Textarea rows={3} value={data.quote_fr} onChange={(e) => setData("quote_fr", e.target.value)} />
                  {errors.quote_fr && <p className="text-xs text-destructive">{errors.quote_fr}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Avatar (optional)</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setData("avatar", e.target.files?.[0] ?? null)} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <Label className="cursor-pointer">Published</Label>
                  <Switch checked={data.is_published} onCheckedChange={(v) => setData("is_published", v)} />
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={processing} className="bg-gradient-blue text-white">
              {processing ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}