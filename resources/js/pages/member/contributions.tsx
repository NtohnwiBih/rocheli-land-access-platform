import { Head, router, usePage } from "@inertiajs/react";
import { useEcho } from '@laravel/echo-react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Search,
  Filter,
  Plus,
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
import { AddContributionDialog, type ContributionProject } from "@/components/member/AddContributionDialog";
import { toast } from "sonner";

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
  projects: ContributionProject[];
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
  const { projects, project_breakdown, pending_count, initial_project_filter } = props;
  const [contributions, setContributions] = useState<Row[]>(props.contributions);

  const [viewProofId, setViewProofId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>(initial_project_filter);

  useEffect(() => {
    setContributions(props.contributions);
  }, [props.contributions]);

  const memberId = (props as any).auth?.user?.member?.id as number | undefined;

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

  const filteredRows = contributions.filter((r) => {
    const matchesSearch =
      (r.ref ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.project ?? "").toLowerCase().includes(search.toLowerCase());
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
            <AddContributionDialog
              projects={projects}
              trigger={
                <Button variant="brand" disabled={projects.length === 0}>
                  <Plus className="mr-1 h-4 w-4" /> Add contribution
                </Button>
              }
            />
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