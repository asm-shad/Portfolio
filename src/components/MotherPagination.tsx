"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalPages: number;
  queryKey?: string; // default: "page"
  basePath?: string; // optional custom base route (e.g. "/blog")
  extraParams?: Record<string, string | number | undefined>; // optional filters
}

export default function MotherPagination({
  totalPages,
  queryKey = "page",
  basePath,
  extraParams = {},
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const currentPage = Math.max(1, Number(sp.get(queryKey) ?? "1"));

  const setPage = (p: number) => {
    const params = new URLSearchParams(sp);
    params.set(queryKey, String(p));

    // Apply any extra parameters (like tab, filter, etc.)
    for (const [key, val] of Object.entries(extraParams)) {
      if (val !== undefined) params.set(key, String(val));
    }

    const route = basePath ?? pathname;
    router.push(`${route}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => setPage(currentPage - 1)}
      >
        Prev
      </Button>
      <span className="text-sm opacity-70">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => setPage(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
