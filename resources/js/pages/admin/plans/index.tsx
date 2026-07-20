import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/custom-dialog";

type Plan = {
  id: number;
  slug: string;
  name: string;
  target_price: number;
  daily_amount: number;
  weekly_amount: number;
  monthly_amount: number;
  is_flexible: boolean;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  subscribers_count: number;
};

interface Props {
  plans: Plan[];
}

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);

export default function PlansIndex({ plans }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: "",
    target_price: "",
    daily_amount: "",
    weekly_amount: "",
    monthly_amount: "",
    is_flexible: false,
    is_featured: false,
    sort_order: 0,
    is_active: true,
  });

  const openCreate = () => {
    setEditing(null);
    reset();
    setOpen(true);
  };

  const openEdit = (p: Plan) => {
    setEditing(p);
    setData({
      name: p.name,
      target_price: String(p.target_price),
      daily_amount: String(p.daily_amount),
      weekly_amount: String(p.weekly_amount),
      monthly_amount: String(p.monthly_amount),
      is_flexible: p.is_flexible,
      is_featured: p.is_featured,
      sort_order: p.sort_order,
      is_active: p.is_active,
    });
    setOpen(true);
  };

  const submit = () => {
    const options = {
      preserveScroll: true,
      onSuccess: () => { setOpen(false); reset(); },
    };
    if (editing) {
      put(`/rocheli/plans/${editing.id}`, options);
    } else {
      post("/rocheli/plans", options);
    }
  };

  const destroy = (id: number) => {
    if (!confirm("Delete this plan? Only possible if no members are subscribed to it.")) return;
    router.delete(`/rocheli/plans/${id}`, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Plans" />
      <div className="p-4 space-y-6">
        <AdminPageHeader
          title="Plans"
          description="Contribution plans members can subscribe to, with rates and targets."
          action={
            <Button onClick={openCreate} size="sm" className="bg-gradient-blue text-white rounded-full">
              <Plus className="h-3.5 w-3.5" /> Add plan
            </Button>
          }
        />

        <AdminTable headers={["Name", "Target", "Daily", "Weekly", "Monthly", "Subscribers", "Status", ""]}>
          {plans.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1.5">
                  {p.name}
                  {p.is_featured && <Star className="h-3.5 w-3.5 fill-rocheli-gold text-rocheli-gold" />}
                </div>
              </TableCell>
              <TableCell className="font-medium">{formatXAF(p.target_price)}</TableCell>
              <TableCell className="text-muted-foreground">{formatXAF(p.daily_amount)}{p.is_flexible && "+"}</TableCell>
              <TableCell className="text-muted-foreground">{formatXAF(p.weekly_amount)}{p.is_flexible && "+"}</TableCell>
              <TableCell className="text-muted-foreground">{formatXAF(p.monthly_amount)}{p.is_flexible && "+"}</TableCell>
              <TableCell className="text-muted-foreground">{p.subscribers_count}</TableCell>
              <TableCell>
                <Badge variant={p.is_active ? "secondary" : "outline"}>{p.is_active ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => destroy(p.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </AdminTable>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit plan" : "Add plan"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="min-h-0 flex-1 overflow-y-auto px-6">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={data.name} onChange={(e) => setData("name", e.target.value)} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Target price (FCFA)</Label>
                  <Input type="number" value={data.target_price} onChange={(e) => setData("target_price", e.target.value)} />
                  {errors.target_price && <p className="text-xs text-destructive">{errors.target_price}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Daily amount</Label>
                    <Input type="number" value={data.daily_amount} onChange={(e) => setData("daily_amount", e.target.value)} />
                    {errors.daily_amount && <p className="text-xs text-destructive">{errors.daily_amount}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Weekly amount</Label>
                    <Input type="number" value={data.weekly_amount} onChange={(e) => setData("weekly_amount", e.target.value)} />
                    {errors.weekly_amount && <p className="text-xs text-destructive">{errors.weekly_amount}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly amount</Label>
                    <Input type="number" value={data.monthly_amount} onChange={(e) => setData("monthly_amount", e.target.value)} />
                    {errors.monthly_amount && <p className="text-xs text-destructive">{errors.monthly_amount}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sort order</Label>
                  <Input type="number" value={data.sort_order} onChange={(e) => setData("sort_order", Number(e.target.value))} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div>
                      <Label className="cursor-pointer">Flexible amounts</Label>
                      <p className="text-xs text-muted-foreground">Rates shown as minimums (e.g. "10,000+ F") — members can contribute more.</p>
                    </div>
                    <Switch checked={data.is_flexible} onCheckedChange={(v) => setData("is_flexible", v)} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border p-3">
                    <Label className="cursor-pointer">Featured (highlighted at registration)</Label>
                    <Switch checked={data.is_featured} onCheckedChange={(v) => setData("is_featured", v)} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border p-3">
                    <Label className="cursor-pointer">Active (visible to new members)</Label>
                    <Switch checked={data.is_active} onCheckedChange={(v) => setData("is_active", v)} />
                  </div>
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