import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/custom-dialog";

type Category = {
  id: number;
  slug: string;
  name_en: string;
  name_fr: string;
  type: "article" | "property";
  sort_order: number;
  is_active: boolean;
  articles_count: number;
  properties_count: number;
};

interface Props {
  categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
  const [filter, setFilter] = useState<"all" | "article" | "property">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name_en: "",
    name_fr: "",
    type: "article" as "article" | "property",
    sort_order: 0,
    is_active: true,
  });

  const openCreate = () => {
    setEditing(null);
    reset();
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setData({ name_en: c.name_en, name_fr: c.name_fr, type: c.type, sort_order: c.sort_order, is_active: c.is_active });
    setOpen(true);
  };

  const submit = () => {
    const options = {
      preserveScroll: true,
      onSuccess: () => { setOpen(false); reset(); },
    };
    if (editing) {
      put(`/rocheli/categories/${editing.id}`, options);
    } else {
      post("/rocheli/categories", options);
    }
  };

  const destroy = (id: number) => {
    if (!confirm("Delete this category? Only possible if unused.")) return;
    router.delete(`/rocheli/categories/${id}`, { preserveScroll: true });
  };

  const filtered = categories.filter((c) => filter === "all" || c.type === filter);

  return (
    <>
      <Head title="Categories" />
      <div className="space-y-6">
        <AdminPageHeader
          title="Categories"
          description="Shared taxonomy used by Articles and Properties."
          action={
            <Button onClick={openCreate} size="sm" className="bg-gradient-blue text-white rounded-full">
              <Plus className="h-3.5 w-3.5" /> Add category
            </Button>
          }
        />

        <div className="inline-flex rounded-full border border-border bg-muted p-1">
          {(["all", "article", "property"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                filter === f ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {f === "all" ? "All" : `${f}s`}
            </button>
          ))}
        </div>

        <AdminTable headers={["Name (EN)", "Type", "In use", "Status", ""]}>
          {filtered.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name_en}</TableCell>
              <TableCell><Badge variant="outline" className="capitalize">{c.type}</Badge></TableCell>
              <TableCell className="text-muted-foreground">
                {c.type === "article" ? `${c.articles_count} articles` : `${c.properties_count} properties`}
              </TableCell>
              <TableCell>
                <Badge variant={c.is_active ? "secondary" : "outline"}>{c.is_active ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => destroy(c.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </AdminTable>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="min-h-0 flex-1 overflow-y-auto px-6">
              <div className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name (EN)</Label>
                    <Input value={data.name_en} onChange={(e) => setData("name_en", e.target.value)} />
                    {errors.name_en && <p className="text-xs text-destructive">{errors.name_en}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Name (FR)</Label>
                    <Input value={data.name_fr} onChange={(e) => setData("name_fr", e.target.value)} />
                    {errors.name_fr && <p className="text-xs text-destructive">{errors.name_fr}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Applies to</Label>
                  <Select value={data.type} onValueChange={(v) => setData("type", v as "article" | "property")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Articles</SelectItem>
                      <SelectItem value="property">Properties</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sort order</Label>
                  <Input type="number" value={data.sort_order} onChange={(e) => setData("sort_order", Number(e.target.value))} />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <Label className="cursor-pointer">Active</Label>
                  <Switch checked={data.is_active} onCheckedChange={(v) => setData("is_active", v)} />
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