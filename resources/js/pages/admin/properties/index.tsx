import { Head, Link, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PropertyRow = {
  id: number;
  title: string;
  location: string;
  category: string;
  price: string;
  status: string;
  image: string | null;
};

interface Props {
  properties: PropertyRow[];
}

const statusColor: Record<string, string> = {
  Available: "bg-emerald-500 text-white",
  "Selling Fast": "bg-rocheli-blue text-white",
  Reserved: "bg-rocheli-gold text-rocheli-navy",
  Sold: "bg-muted text-muted-foreground",
};

export default function PropertiesIndex({ properties }: Props) {
  const destroy = (id: number) => {
    if (!confirm("Delete this property?")) return;
    router.delete(`/rocheli/properties/${id}`, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Properties" />
      <div className="space-y-6">
        <AdminPageHeader
          title="Properties"
          description="Manage listings shown on the public site and to members."
          action={
            <Link href="/rocheli/properties/create">
              <Button size="sm" className="bg-gradient-blue text-white rounded-full">
                <Plus className="h-3.5 w-3.5" /> New property
              </Button>
            </Link>
          }
        />

        <AdminTable headers={["Property", "Category", "Location", "Price", "Status", ""]}>
          {properties.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="flex items-center gap-3 font-medium">
                {p.image && <img src={p.image} alt="" className="h-10 w-14 rounded-lg object-cover" />}
                {p.title}
              </TableCell>
              <TableCell className="text-muted-foreground">{p.category}</TableCell>
              <TableCell className="text-muted-foreground">{p.location}</TableCell>
              <TableCell className="font-medium">{p.price}</TableCell>
              <TableCell>
                <Badge className={statusColor[p.status] ?? ""}>{p.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Link href={`/rocheli/properties/${p.id}/edit`}>
                    <Button size="icon" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                  </Link>
                  <Button size="icon" variant="ghost" onClick={() => destroy(p.id)}>
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