import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";

type MemberRow = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  city: string;
  status: string;
  plans_count: number;
  joined_at: string;
};

interface Props {
  members: MemberRow[];
  filters: { search?: string; status?: string };
}

const PAGE_SIZE = 10;

const statusColor: Record<string, string> = {
  approved: "bg-emerald-500 text-white",
  rejected: "bg-destructive text-destructive-foreground",
  under_review: "bg-rocheli-blue text-white",
  pending: "bg-muted text-muted-foreground",
};

export default function MembersIndex({ members, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");

  const {
    page,
    totalPages,
    paginatedItems: paginatedMembers,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  } = usePagination(members, PAGE_SIZE);

  const applyFilters = (next: Partial<typeof filters>) => {
    router.get("/rocheli/members", { ...filters, ...next }, { preserveState: true, replace: true });
  };

  return (
    <>
      <Head title="Members" />
      <div className="space-y-6">
        <AdminPageHeader title="Members" description="All registered members and their projects." />

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search by name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters({ search })}
            />
          </div>
          <Select value={filters.status ?? "all"} onValueChange={(v) => applyFilters({ status: v === "all" ? undefined : v })}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AdminTable headers={["Name", "Contact", "City", "Projects", "Status", "Joined", ""]}>
          {paginatedMembers.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell className="text-muted-foreground">{m.phone}{m.email ? ` · ${m.email}` : ""}</TableCell>
              <TableCell className="text-muted-foreground">{m.city}</TableCell>
              <TableCell>{m.plans_count}</TableCell>
              <TableCell>
                <Badge className={statusColor[m.status] ?? ""}>{m.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{m.joined_at}</TableCell>
              <TableCell>
                <Link href={`/rocheli/members/${m.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  View <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </AdminTable>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={prevPage}
          onNext={nextPage}
          hasPrev={hasPrev}
          hasNext={hasNext}
          totalItems={members.length}
        />
      </div>
    </>
  );
}