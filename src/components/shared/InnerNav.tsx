"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const tabs = [
  { key: "projects", label: "Projects" },
  { key: "blog", label: "Blog" },
  { key: "about", label: "About" },
];

export default function InnerNav() {
  const pathname = usePathname();
  const search = useSearchParams();
  const active = search.get("tab") ?? "projects";

  return (
    <nav className="border-b bg-background/70 backdrop-blur-md">
      <div className="container flex h-12 items-center gap-3 px-4">
        {tabs.map((t) => {
          const href = `${pathname}?tab=${t.key}`;
          const isActive = active === t.key;
          return (
            <Link
              key={t.key}
              href={href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "px-3 text-sm font-medium hover:text-primary",
                isActive
                  ? "text-primary border-b-2 border-primary rounded-none"
                  : "text-muted-foreground"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
