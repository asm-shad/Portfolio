"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FilePlus, Code2, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/create-post", label: "Create Post", icon: FilePlus },
  { href: "/dashboard/create-project", label: "Create Project", icon: Code2 },
  { href: "/dashboard/edit-profile", label: "Edit Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-card p-4">
      {/* ---------- Top section ---------- */}
      <div className="px-2">
        <h1 className="text-lg font-bold">Portfolio Admin</h1>
        <p className="text-xs text-muted-foreground">
          Manage content & analytics
        </p>
      </div>

      {/* ---------- Navigation links ---------- */}
      <nav className="mt-6 flex-1 space-y-1">
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

      {/* ---------- Bottom Logout Button ---------- */}
      {status === "authenticated" && (
        <div className="border-t pt-4 mt-2">
          <Button
            variant="destructive"
            className="w-full justify-start gap-2"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </aside>
  );
}
