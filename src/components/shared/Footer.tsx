/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface OwnerData {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
}

export default function Footer() {
  const [owner, setOwner] = useState<OwnerData | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_API;
        if (!base) {
          console.warn("NEXT_PUBLIC_BASE_API not available");
          return;
        }

        const res = await fetch(`${base}/user`);
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

  // Use owner data or fallback
  const githubUrl = owner?.github || "https://github.com/";
  const linkedinUrl = owner?.linkedin || "https://linkedin.com/";
  const twitterUrl = owner?.twitter || "https://twitter.com/";
  const websiteUrl = owner?.website || "#";
  const email = owner?.email || "";
  const phone = owner?.phone || "";
  const name = owner?.name || "Portfolio Owner";

  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}`
    : null;
  const emailUrl = email ? `mailto:${email}` : null;

  return (
    <footer className="bg-background border-t py-10 relative">
      <div className="px-4 flex flex-col items-center gap-10 container mx-auto">
        <div className="space-y-6 text-center">
          <p className="uppercase text-xs tracking-widest text-muted-foreground">
            Have a project in mind?
          </p>

          <h2 className="text-6xl md:text-8xl font-bold text-muted-foreground/20 leading-none select-none">
            LET&apos;S TALK
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {emailUrl && (
              <Link
                href={emailUrl}
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                Email
              </Link>
            )}

            {whatsappUrl && (
              <Link
                href={whatsappUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                WhatsApp
              </Link>
            )}

            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                GitHub
              </Link>
            )}

            {linkedinUrl && (
              <Link
                href={linkedinUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                LinkedIn
              </Link>
            )}

            {twitterUrl && (
              <Link
                href={twitterUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                Twitter
              </Link>
            )}

            {websiteUrl && websiteUrl !== "#" && (
              <Link
                href={websiteUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                Website
              </Link>
            )}
          </div>

          {(email || phone) && (
            <div className="text-xs text-muted-foreground flex flex-wrap justify-center gap-3">
              {email && (
                <span>
                  <strong>E:</strong> {email}
                </span>
              )}
              {phone && (
                <span>
                  <strong>P:</strong> {phone}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 text-xs text-muted-foreground">
          <span>
            © {year} {name}
          </span>

          <div className="flex items-center gap-1">
            <span>Developed and Designed by</span>
            <Link
              href={githubUrl}
              target="_blank"
              className="underline hover:text-primary"
            >
              {name}
            </Link>
          </div>

          <a
            href="#top"
            className="flex items-center gap-1 hover:text-primary transition group"
          >
            <span className="hidden sm:inline text-xs">BACK TO TOP</span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-background text-xs group-hover:scale-110 transition">
              <ArrowUp className="h-3 w-3" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
