import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
} from "@/components/ui/custom-dialog";

type Faq = {
  id: number;
  question_en: string;
  question_fr: string;
  answer_en: string;
  answer_fr: string;
  sort_order: number;
  is_published: boolean;
};

interface Props {
  faqs: Faq[];
}

export default function FaqsIndex({ faqs }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    question_en: "",
    question_fr: "",
    answer_en: "",
    answer_fr: "",
    sort_order: 0,
    is_published: true,
  });

  const openCreate = () => {
    setEditing(null);
    reset();
    setOpen(true);
  };

  const openEdit = (f: Faq) => {
    setEditing(f);
    setData({
      question_en: f.question_en,
      question_fr: f.question_fr,
      answer_en: f.answer_en,
      answer_fr: f.answer_fr,
      sort_order: f.sort_order,
      is_published: f.is_published,
    });
    setOpen(true);
  };

  const submit = () => {
    const options = {
      preserveScroll: true,
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    };

    if (editing) {
      put(`/rocheli/faqs/${editing.id}`, options);
    } else {
      post("/rocheli/faqs", options);
    }
  };

  const destroy = (id: number) => {
    if (!confirm("Remove this FAQ?")) return;
    router.delete(`/rocheli/faqs/${id}`, { preserveScroll: true });
  };

  return (
    <>
      <Head title="FAQs" />
      <div className="space-y-6">
        <AdminPageHeader
          title="FAQs"
          description="Manage frequently asked questions shown on the homepage."
          action={
            <Button onClick={openCreate} size="sm" className="bg-gradient-blue text-white rounded-full">
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </Button>
          }
        />

        <AdminTable headers={["Question (EN)", "Status", ""]}>
          {faqs.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="max-w-lg font-medium">{f.question_en}</TableCell>
              <TableCell>
                <Badge variant={f.is_published ? "secondary" : "outline"}>
                  {f.is_published ? "Published" : "Hidden"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(f)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => destroy(f.id)}>
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
            <DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="min-h-0 flex-1 overflow-y-auto px-6">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Question (EN)</Label>
                  <Input value={data.question_en} onChange={(e) => setData("question_en", e.target.value)} />
                  {errors.question_en && <p className="text-xs text-destructive">{errors.question_en}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Question (FR)</Label>
                  <Input value={data.question_fr} onChange={(e) => setData("question_fr", e.target.value)} />
                  {errors.question_fr && <p className="text-xs text-destructive">{errors.question_fr}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Answer (EN)</Label>
                  <Textarea rows={3} value={data.answer_en} onChange={(e) => setData("answer_en", e.target.value)} />
                  {errors.answer_en && <p className="text-xs text-destructive">{errors.answer_en}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Answer (FR)</Label>
                  <Textarea rows={3} value={data.answer_fr} onChange={(e) => setData("answer_fr", e.target.value)} />
                  {errors.answer_fr && <p className="text-xs text-destructive">{errors.answer_fr}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Sort order</Label>
                  <Input type="number" value={data.sort_order} onChange={(e) => setData("sort_order", Number(e.target.value))} />
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