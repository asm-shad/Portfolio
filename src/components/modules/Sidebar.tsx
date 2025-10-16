"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FilePlus, Code2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/create-post", label: "Create Post", icon: FilePlus },
  { href: "/dashboard/create-project", label: "Create Project", icon: Code2 },
  { href: "/dashboard/edit-profile", label: "Edit Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card p-4 space-y-4 hidden md:block">
      <div className="px-2">
        <h1 className="text-lg font-bold">Portfolio Admin</h1>
        <p className="text-xs text-muted-foreground">
          Manage content & analytics
        </p>
      </div>

      <nav className="mt-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition",
                isActive ? "bg-muted text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
