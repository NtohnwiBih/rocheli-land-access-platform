import { Head, Link, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";

type TeamMemberRow = {
  id: number;
  name_en: string;
  position_en: string;
  image: string | null;
  order: number;
};

interface Props {
  members: TeamMemberRow[];
}

export default function TeamMembersIndex({ members }: Props) {
  const destroy = (id: number) => {
    if (!confirm("Delete this team member?")) return;
    router.delete(`/rocheli/team-members/${id}`, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Team members" />
      <div className="space-y-6">
        <AdminPageHeader
          title="Team members"
          description="Manage the people shown on the About / Team page."
          action={
            <Link href="/rocheli/team-members/create">
              <Button size="sm" className="bg-gradient-blue text-white rounded-full">
                <Plus className="h-3.5 w-3.5" /> New member
              </Button>
            </Link>
          }
        />

        <AdminTable headers={["Name", "Position", "Order", ""]}>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="flex items-center gap-3 font-medium">
                {m.image ? (
                  <img src={m.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted" />
                )}
                {m.name_en}
              </TableCell>
              <TableCell className="text-muted-foreground">{m.position_en}</TableCell>
              <TableCell className="text-muted-foreground">{m.order}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Link href={`/rocheli/team-members/${m.id}/edit`}>
                    <Button size="icon" variant="ghost">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button size="icon" variant="ghost" onClick={() => destroy(m.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </AdminTable>
      </div>
    </>
  );
}