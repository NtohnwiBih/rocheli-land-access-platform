import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEcho } from '@laravel/echo-react';
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Download,
  Search,
  Filter,
  Plus,
  Upload,
  ImageIcon,
  X,
  Eye,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Status = "Pending" | "Successful" | "Rejected";

type Row = {
  id: number;
  date: string;
  amount: number;
  method: string;
  ref: string;
  status: Status;
  has_proof: boolean;
  note: string | null;
  project_id: number;
  project: string;
};

type Project = {
  id: number;
  label: string;
  payment_method: string;
};

type ProjectBreakdown = {
  id: number;
  label: string;
  target_price: number;
  total_contributed: number;
  this_year: number;
  is_completed: boolean;
};

type ContributionUpdatedPayload = {
  id: number;
  status: Row["status"];
  rejection_reason: string | null;
};

interface PageProps {
  contributions: Row[];
  projects: Project[];
  project_breakdown: ProjectBreakdown[];
  stats: {
    total_contributed: number;
    this_year: number;
  };
  pending_count: number;
  initial_project_filter: string;
  [key: string]: unknown;
}

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(n);

export default function Contributions() {
  const { props } = usePage<PageProps>();
  const { projects, project_breakdown, stats, pending_count, initial_project_filter } = props;
  const [contributions, setContributions] = useState<Row[]>(props.contributions);

  const [open, setOpen] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [viewProofId, setViewProofId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>(initial_project_filter);;
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    member_plan_id: projects[0]?.id ?? null,
    amount: "",
    method: projects[0]?.payment_method ?? "Bank Transfer",
    note: "",
    proof: null as File | null,
  });

  useEffect(() => {
    setContributions(props.contributions);
  }, [props.contributions]);

  const memberId = (props as any).auth?.user?.member?.id as number | undefined;
  console.log('Echo debug — memberId:', memberId, 'channel:', memberId ? `member.${memberId}` : '(empty)');

  useEcho<ContributionUpdatedPayload>(
    memberId ? `member.${memberId}` : '',
    '.ContributionStatusUpdated',
    (e) => {
      setContributions((prev) =>
        prev.map((r) => (r.id === e.id ? { ...r, status: e.status } : r)),
      );
      toast.success(`Contribution ${e.id} updated to ${e.status}`);
      
      router.reload({ only: ['project_breakdown', 'stats', 'pending_count'] });
    },
    [memberId],
    'private',
  );

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

  const filteredRows = contributions.filter((r) => {
    const matchesSearch =
      r.ref.toLowerCase().includes(search.toLowerCase()) ||
      r.project.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === "all" || String(r.project_id) === projectFilter;
    return matchesSearch && matchesProject;
  });

  return (
    <>
      <Head title="Contributions — Rocheli" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black md:text-3xl">Contributions</h1>
            <p className="text-sm text-muted-foreground">
              Every transaction, always at your fingertips.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
              <DialogTrigger asChild>
                <Button variant="brand" disabled={projects.length === 0}>
                  <Plus className="mr-1 h-4 w-4" /> Add contribution
                </Button>
              </DialogTrigger>
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
                        setData("member_plan_id", Number(v));
                        if (project) setData("method", project.payment_method);
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
          </div>
        </div>

        {projects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            You don't have any active projects yet. Subscribe to a plan to start contributing.
          </div>
        )}

        {pending_count > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <Clock className="mt-0.5 h-4 w-4 text-amber-600" />
            <div>
              <div className="font-semibold">
                {pending_count} contribution{pending_count > 1 ? "s" : ""} awaiting validation
              </div>
              <div className="text-muted-foreground">
                An admin will review your proof of payment and update the status shortly.
              </div>
            </div>
          </div>
        )}

        {project_breakdown.length > 1 && (
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {project_breakdown.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.label}{p.is_completed ? " ✓" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="rounded-3xl bg-card p-6 shadow-card">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by receipt or project..."
                className="h-10 pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {projects.length > 1 && (
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline">
              <Filter className="mr-1 h-4 w-4" /> Filter
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                      No contributions yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell className="text-muted-foreground">{r.project}</TableCell>
                      <TableCell className="font-semibold">{formatXAF(r.amount)}</TableCell>
                      <TableCell>{r.method}</TableCell>
                      <TableCell className="text-muted-foreground">{r.ref}</TableCell>
                      <TableCell>
                        {r.has_proof ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1 px-2"
                            onClick={() => setViewProofId(r.id)}
                          >
                            <Eye className="h-4 w-4" /> View
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.status === "Successful"
                              ? "secondary"
                              : r.status === "Rejected"
                              ? "destructive"
                              : "outline"
                          }
                          className={
                            r.status === "Pending"
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              : ""
                          }
                        >
                          {r.status === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={viewProofId !== null} onOpenChange={(v) => !v && setViewProofId(null)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Proof of payment</DialogTitle>
              <DialogDescription>
                Submitted receipt awaiting or verified by admin.
              </DialogDescription>
            </DialogHeader>
            {viewProofId !== null && (
              <img
                src={`/member/contributions/${viewProofId}/proof`}
                alt="Proof of payment"
                className="max-h-[70vh] w-full rounded-xl object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}