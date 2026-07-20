import { Head, Link, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { AdminTable, TableRow, TableCell } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ArticleRow = {
  id: number;
  slug: string;
  title_en: string;
  category_en: string;
  author: string | null;
  image: string | null;
  published_at: string | null;
  is_published: boolean;
};

interface Props {
  articles: ArticleRow[];
}

export default function ArticlesIndex({ articles }: Props) {
  const destroy = (id: number) => {
    if (!confirm("Delete this article?")) return;
    router.delete(`/rocheli/articles/${id}`, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Articles" />
      <div className="space-y-6">
        <AdminPageHeader
          title="Articles"
          description="Manage blog posts shown on the homepage and resources page."
          action={
            <Link href="/rocheli/articles/create">
              <Button size="sm" className="bg-gradient-blue text-white rounded-full">
                <Plus className="h-3.5 w-3.5" /> New article
              </Button>
            </Link>
          }
        />

        <AdminTable headers={["Title", "Category", "Author", "Published", "Status", ""]}>
          {articles.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="flex items-center gap-3 font-medium">
                {a.image && <img src={a.image} alt="" className="h-10 w-14 rounded-lg object-cover" />}
                {a.title_en}
              </TableCell>
              <TableCell className="text-muted-foreground">{a.category_en}</TableCell>
              <TableCell className="text-muted-foreground">{a.author ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{a.published_at ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={a.is_published ? "secondary" : "outline"}>
                  {a.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Link href={`/rocheli/articles/${a.id}/edit`}>
                    <Button size="icon" variant="ghost">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button size="icon" variant="ghost" onClick={() => destroy(a.id)}>
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