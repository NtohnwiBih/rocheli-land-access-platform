import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PropertyPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const delta = 1;
  const pages: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  if (left > 2) pages.push("ellipsis");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("ellipsis");
  if (total > 1) pages.push(total);

  return pages;
}

export function PropertyPagination({ page, totalPages, onPageChange, className = "" }: PropertyPaginationProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label={t("properties.pagination.label", "Pagination")}
      className={`flex items-center justify-center gap-1.5 ${className}`}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label={t("properties.pagination.prev", "Previous page")}
        className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="grid h-10 w-10 place-items-center text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition ${
              p === page
                ? "bg-gradient-blue text-white shadow-glow"
                : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label={t("properties.pagination.next", "Next page")}
        className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}