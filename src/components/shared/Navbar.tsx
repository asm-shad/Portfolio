/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Logo from "@/components/logo";
import { useEffect, useState } from "react";

interface OwnerData {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [owner, setOwner] = useState<OwnerData | null>(null);

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  // Fetch owner data
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user`);
        if (res.ok) {
          const users = await res.json();
          const ownerData = Array.isArray(users)
            ? users.find((user: any) =>
                ["ADMIN", "SUPER_ADMIN"].includes(user.role)
              )
            : null;
          setOwner(ownerData);
        }
      } catch (error) {
        console.error("Failed to fetch owner data:", error);
      }
    };

    fetchOwnerData();
  }, []);

  // Use owner data with fallbacks
  const email = owner?.email || user?.email || "owner@example.com";
  const phone = owner?.phone || "+880-1234-567890";
  const location = owner?.location || "Dhaka, Bangladesh";
  const linkedinUrl = owner?.linkedin || "https://linkedin.com/";
  const githubUrl = owner?.github || "https://github.com/";

  const emailUrl = `mailto:${email}`;
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}`
    : null;

  return (
    <header className="border-b backdrop-blur-sm px-4 md:px-8 sticky top-0 z-50 bg-background/95">
      <div className="flex h-16 items-center justify-between container mx-auto">
        {/* ---------- LEFT SIDE ---------- */}
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* ---------- RIGHT SIDE ---------- */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ModeToggle />

          {/* About Me Button */}
          <Button
            variant="ghost"
            className="font-medium"
            onClick={() => router.push("/about")}
          >
            About Me
          </Button>

          {/* Dashboard / Admin Panel */}
          {isAuthenticated ? (
            <Button
              variant="ghost"
              className="font-medium"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="font-medium"
              onClick={() => router.push("/login")}
            >
              Login
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
              <Button className="bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80">
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
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{location}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={emailUrl}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Link>
                </Button>
                {whatsappUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={whatsappUrl} target="_blank">
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Link>
                  </Button>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex gap-2">
                  {linkedinUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={linkedinUrl} target="_blank">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        LinkedIn
                      </Link>
                    </Button>
                  )}
                  {githubUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={githubUrl} target="_blank">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
