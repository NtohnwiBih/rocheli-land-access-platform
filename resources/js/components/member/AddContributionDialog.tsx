import { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, ImageIcon, X } from "lucide-react";

export type ContributionProject = {
  id: number;
  label: string;
  payment_method: string;
  contribution_frequency: string | null;
  contribution_amount: number | null;
};

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(n);

interface AddContributionDialogProps {
  projects: ContributionProject[];
  trigger: React.ReactNode;
  /** Pre-select a project, e.g. when opened from that project's card. */
  defaultProjectId?: number;
}

export function AddContributionDialog({ projects, trigger, defaultProjectId }: AddContributionDialogProps) {
  const [open, setOpen] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const firstProject = projects.find((p) => p.id === defaultProjectId) ?? projects[0];

  const { data, setData, post, processing, errors, reset } = useForm({
    member_plan_id: firstProject?.id ?? null,
    amount: firstProject?.contribution_amount != null ? String(firstProject.contribution_amount) : "",
    method: firstProject?.payment_method ?? "Bank Transfer",
    note: "",
    proof: null as File | null,
  });

  const selectedProject = projects.find((p) => p.id === data.member_plan_id);

  // Keep the default project in sync if the dialog is reopened with a different one.
  useEffect(() => {
    if (open) {
      setData((prev) => ({
        ...prev,
        member_plan_id: firstProject?.id ?? null,
        amount: firstProject?.contribution_amount != null ? String(firstProject.contribution_amount) : "",
        method: firstProject?.payment_method ?? "Bank Transfer",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultProjectId]);

  const onFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG).");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB.");
      return;
    }
    setData("proof", f);
    setProofPreview(URL.createObjectURL(f));
  };

  const resetForm = () => {
    reset();
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofPreview(null);
  };

  const submit = () => {
    post("/member/contributions", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setOpen(false);
        resetForm();
        toast.success("Contribution submitted — awaiting admin validation.");
      },
      onError: () => {
        const firstError = Object.values(errors)[0];
        if (firstError) toast.error(firstError as string);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit a contribution</DialogTitle>
          <DialogDescription>
            Upload proof of payment and enter the amount sent. Your contribution
            will remain <span className="font-semibold text-foreground">Pending</span> until
            an admin validates it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Project</Label>
            <Select
              value={data.member_plan_id ? String(data.member_plan_id) : undefined}
              onValueChange={(v) => {
                const project = projects.find((p) => p.id === Number(v));
                setData((prev) => ({
                  ...prev,
                  member_plan_id: Number(v),
                  method: project?.payment_method ?? prev.method,
                  amount:
                    project?.contribution_amount != null
                      ? String(project.contribution_amount)
                      : prev.amount,
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.member_plan_id && <p className="text-xs text-destructive">{errors.member_plan_id}</p>}
            {selectedProject && selectedProject.contribution_amount != null && (
              <p className="text-xs text-muted-foreground">
                This project's usual contribution is {formatXAF(selectedProject.contribution_amount)} per{" "}
                {selectedProject.contribution_frequency?.toLowerCase() ?? "period"}. Amount below is pre-filled — adjust if you're paying a different amount.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount sent (FCFA)</Label>
            <Input
              id="amount"
              inputMode="numeric"
              placeholder="e.g. 75000"
              value={data.amount}
              onChange={(e) => setData("amount", e.target.value)}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label>Payment method</Label>
            <Select
              value={data.method}
              onValueChange={(v) => setData("method", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN Mobile Money">MTN Mobile Money</SelectItem>
                <SelectItem value="Orange Money">Orange Money</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cash Deposit">Cash Deposit</SelectItem>
              </SelectContent>
            </Select>
            {errors.method && <p className="text-xs text-destructive">{errors.method}</p>}
          </div>

          <div className="space-y-2">
            <Label>Proof of payment</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            {!proofPreview ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground transition hover:border-primary hover:bg-muted/50"
              >
                <Upload className="h-6 w-6" />
                <span className="font-medium text-foreground">
                  Click to upload receipt image
                </span>
                <span className="text-xs">PNG or JPG — up to 5 MB</span>
              </button>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img
                  src={proofPreview}
                  alt="Proof of payment"
                  className="max-h-56 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-2 border-t border-border bg-card p-2 text-xs">
                  <span className="flex items-center gap-2 truncate">
                    <ImageIcon className="h-4 w-4" />
                    <span className="truncate">{data.proof?.name}</span>
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (proofPreview) URL.revokeObjectURL(proofPreview);
                      setData("proof", null);
                      setProofPreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            {errors.proof && <p className="text-xs text-destructive">{errors.proof}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              placeholder="e.g. September contribution"
              value={data.note}
              onChange={(e) => setData("note", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button variant="brand" onClick={submit} disabled={processing}>
            {processing ? "Submitting..." : "Submit for validation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}