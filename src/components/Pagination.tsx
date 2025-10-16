// components/Pagination.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const page = Number(sp.get("page") ?? "1");
  const tab = sp.get("tab") ?? "projects";

  const setPage = (p: number) => {
    const params = new URLSearchParams(sp);
    params.set("tab", tab);
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </Button>
      <span className="text-sm opacity-70">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
