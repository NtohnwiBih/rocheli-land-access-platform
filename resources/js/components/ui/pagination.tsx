import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  totalItems?: number;
  hideWhenSinglePage?: boolean;
  className?: string;
};

export function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  totalItems,
  hideWhenSinglePage = true,
  className = "",
}: PaginationProps) {
  if (hideWhenSinglePage && totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between border-t border-border pt-4 ${className}`}>
      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
        {typeof totalItems === "number" && ` · ${totalItems} total`}
      </span>
      <div className="flex gap-1.5">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1 px-2.5"
          disabled={!hasPrev}
          onClick={onPrev}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1 px-2.5"
          disabled={!hasNext}
          onClick={onNext}
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}