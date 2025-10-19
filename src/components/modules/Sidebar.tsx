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
  const { data: session, status } = useSession();
  const userName = session?.user?.name || "User";

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 shadow-lg min-h-screen sticky top-0">
      {/* ---------- Top Section ---------- */}
      <div className="px-3 mb-6 border-b border-slate-700 pb-4">
        <div className="flex flex-col items-start">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-slate-700 text-lg font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-2 text-base font-semibold">{userName}</h2>
          <p className="text-xs text-slate-400">Portfolio Dashboard</p>
        </div>
      </div>

      {/* ---------- Navigation Links ---------- */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* ---------- Logout Button ---------- */}
      {status === "authenticated" && (
        <div className="border-t border-slate-700 pt-4 mt-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
