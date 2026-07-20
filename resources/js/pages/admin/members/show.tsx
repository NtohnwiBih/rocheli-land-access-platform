import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { ArrowLeft, Star, Eye, Check, X, FileText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/custom-dialog";

type Plan = {
  id: number; label: string; plan_name: string; target_price: number; total_contributed: number;
  progress_pct: number; contribution_frequency: string; contribution_amount: number;
  status: string; is_primary: boolean; is_completed: boolean; subscribed_at: string;
};

type Contribution = {
  id: number; date: string; project: string; amount: number; method: string;
  ref: string; status: string; has_proof: boolean; note: string | null;
};

type MemberDetail = {
  id: number; name: string; email: string | null; phone: string; whatsapp: string | null;
  gender: string | null; occupation: string | null; city: string; id_type: string;
  id_number: string; id_document_url: string | null; id_document_back_url: string | null; kin_name: string | null;
  kin_relationship: string | null; kin_phone: string | null; status: string; joined_at: string;
};

interface Props {
  member: MemberDetail;
  plans: Plan[];
  contributions: Contribution[];
}

const formatXAF = (n: number) =>
  new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(n);

const PAGE_SIZE = 10;

type PendingAction =
  | { type: "approve"; contribution: Contribution }
  | { type: "reject"; contribution: Contribution };

export default function MemberShow({ member, plans, contributions }: Props) {
  const [viewProofId, setViewProofId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    page,
    totalPages,
    paginatedItems: paginatedContributions,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  } = usePagination(contributions, PAGE_SIZE);

  const openApprove = (c: Contribution) => setPendingAction({ type: "approve", contribution: c });
  const openReject = (c: Contribution) => {
    setRejectReason("");
    setPendingAction({ type: "reject", contribution: c });
  };
  const closeDialog = () => {
    if (submitting) return;
    setPendingAction(null);
    setRejectReason("");
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    setSubmitting(true);

    const { type, contribution } = pendingAction;
    const url = `/rocheli/contributions/${contribution.id}/${type}`;
    const data = type === "reject" ? { reason: rejectReason } : {};

    router.post(url, data, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(
          type === "approve"
            ? `Contribution ${contribution.ref} approved.`
            : `Contribution ${contribution.ref} rejected.`,
        );
        setPendingAction(null);
        setRejectReason("");
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0];
        toast.error(
          typeof firstError === "string"
            ? firstError
            : `Failed to ${type} contribution. Please try again.`,
        );
      },
      onFinish: () => setSubmitting(false),
    });
  };

  return (
    <>
      <Head title={member.name} />
      <div className="space-y-6">
        <AdminPageHeader
          title={member.name}
          description={`Member since ${member.joined_at}`}
          action={
            <Link href="/rocheli/members">
              <Button variant="outline" size="sm"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button>
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="border border-border bg-card p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold">Profile</h3>
            <dl className="space-y-2 text-sm">
              <Row label="Phone" value={member.phone} />
              <Row label="Email" value={member.email ?? "—"} />
              <Row label="WhatsApp" value={member.whatsapp ?? "—"} />
              <Row label="Occupation" value={member.occupation ?? "—"} />
              <Row label="City" value={member.city} />
              <Row label="ID" value={`${member.id_type} · ${member.id_number}`} />
              <Row label="Next of kin" value={member.kin_name ? `${member.kin_name} (${member.kin_relationship})` : "—"} />
              <Row label="Kin phone" value={member.kin_phone ?? "—"} />
            </dl>
            <div className="flex flex-wrap gap-3">
              {member.id_document_url && (
                <a href={member.id_document_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  <FileText className="h-3.5 w-3.5" /> View ID (front)
                </a>
              )}
              {member.id_document_back_url && (
                <a href={member.id_document_back_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  <FileText className="h-3.5 w-3.5" /> View ID (back)
                </a>
              )}
            </div>
          </div>

          {/* Plans */}
          <div className="lg:col-span-2 border border-border bg-card p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold">Projects ({plans.length})</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {plans.map((p) => (
                <div key={p.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{p.label}</span>
                      {p.is_primary && <Star className="h-3.5 w-3.5 fill-rocheli-gold text-rocheli-gold" />}
                    </div>
                    <Badge className={p.is_completed ? "bg-emerald-600 text-white" : ""} variant={p.is_completed ? undefined : "outline"}>
                      {p.is_completed ? "Funded" : p.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${p.is_completed ? "bg-emerald-500" : "bg-gradient-brand"}`} style={{ width: `${p.progress_pct}%` }} />
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {formatXAF(p.total_contributed)} of {formatXAF(p.target_price)}
                  </div>
                </div>
              ))}
              {plans.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
            </div>
          </div>
        </div>

        {/* Contributions */}
        <div className="border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Contributions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Project</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2 pr-4">Method</th>
                  <th className="pb-2 pr-4">Ref</th>
                  <th className="pb-2 pr-4">Proof</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedContributions.map((c) => (
                  <tr key={c.id} className="border-b border-border/60">
                    <td className="py-2.5 pr-4">{c.date}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{c.project}</td>
                    <td className="py-2.5 pr-4 font-medium">{formatXAF(c.amount)}</td>
                    <td className="py-2.5 pr-4">{c.method}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{c.ref}</td>
                    <td className="py-2.5 pr-4">
                      {c.has_proof ? (
                        <Button size="sm" variant="ghost" className="h-7 gap-1 px-2" onClick={() => setViewProofId(c.id)}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      ) : "—"}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge
                        variant={c.status === "successful" ? "secondary" : c.status === "rejected" ? "destructive" : "outline"}
                        className="capitalize"
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-2.5">
                      {c.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-600" onClick={() => openApprove(c)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => openReject(c)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {contributions.length === 0 && (
                  <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">No contributions yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={prevPage}
            onNext={nextPage}
            hasPrev={hasPrev}
            hasNext={hasNext}
            totalItems={contributions.length}
            className="mt-4"
          />
        </div>
      </div>

      {/* Proof of payment viewer */}
      <Dialog open={viewProofId !== null} onOpenChange={(v) => !v && setViewProofId(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>Proof of payment</DialogTitle></DialogHeader>
          {viewProofId !== null && (
            <img
              src={`/rocheli/contributions/${viewProofId}/proof`}
              alt="Proof of payment"
              className="max-h-[70vh] w-full rounded-xl object-contain px-6 pb-6"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Approve / reject confirmation */}
      <Dialog open={pendingAction !== null} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.type === "approve" ? "Approve contribution?" : "Reject contribution?"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction && (
                <>
                  {pendingAction.type === "approve"
                    ? "This will mark the contribution as successful and update the project's funding progress."
                    : "This will mark the contribution as rejected. The member will be notified."}
                  {" "}
                  <span className="font-medium text-foreground">
                    {formatXAF(pendingAction.contribution.amount)} · {pendingAction.contribution.ref}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {pendingAction?.type === "reject" && (
            <div className="space-y-1.5 px-6">
              <label className="text-xs font-medium text-muted-foreground">
                Reason (optional)
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Receipt image unreadable, amount mismatch…"
                rows={3}
              />
            </div>
          )}

          <DialogFooter className="px-6 pb-6">
            <Button variant="outline" onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={submitting}
              className={
                pendingAction?.type === "approve"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-destructive text-white hover:bg-destructive/90"
              }
            >
              {submitting
                ? "Submitting..."
                : pendingAction?.type === "approve"
                ? "Approve"
                : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}