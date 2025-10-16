"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModeToggle } from "@/components/mode-toggle";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/logo";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  return (
    <header className="border-b backdrop-blur-sm px-4 md:px-8">
      <div className="flex h-16 items-center justify-between container mx-auto">
        {/* ---------- LEFT SIDE ---------- */}
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* ---------- RIGHT SIDE ---------- */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <ModeToggle />

          {/* Dashboard / Admin Panel */}
          {isAuthenticated ? (
            <Button
              variant="ghost"
              className="font-medium"
              onClick={() => router.push("/dashboard")}
            >
              Admin Panel
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="font-medium"
              onClick={() => router.push("/login")}
            >
              Dashboard
            </Button>
          )}

          {/* Optional Logout if logged in */}
          {isAuthenticated && (
            <Button
              variant="outline"
              className="font-medium"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          )}

          {/* Get In Touch popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-black text-white hover:bg-black/80">
                Get In Touch
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 p-5 rounded-xl shadow-lg border bg-background"
            >
              <h3 className="text-lg font-semibold mb-3">Contact Me</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{user?.email ?? "owner@example.com"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+880-1234-567890</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="w-full">
                  Email
                </Button>
                <Button variant="default" className="w-full">
                  LinkedIn
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
