import { useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  function goToPage(next: number) {
    setPage(Math.min(Math.max(1, next), totalPages));
  }

  return {
    page: safePage,
    totalPages,
    paginatedItems,
    setPage: goToPage,
    nextPage: () => goToPage(safePage + 1),
    prevPage: () => goToPage(safePage - 1),
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}