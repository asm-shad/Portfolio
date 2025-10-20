/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUp } from "lucide-react";
import Link from "next/link";

async function getOwnerData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user`, {
      next: { revalidate: 30 }, // Cache for 1 hour
    });

    if (!res.ok) return null;

    const users = await res.json();
    // Find the owner (ADMIN or SUPER_ADMIN)
    const owner = Array.isArray(users)
      ? users.find((user: any) => ["ADMIN", "SUPER_ADMIN"].includes(user.role))
      : null;

    return owner;
  } catch (error) {
    console.error("Failed to fetch owner data:", error);
    return null;
  }
}

export default async function Footer() {
  const year = new Date().getFullYear();
  const owner = await getOwnerData();

  // Extract social links with fallbacks
  const githubUrl = owner?.github || "https://github.com/";
  const linkedinUrl = owner?.linkedin || "https://linkedin.com/";
  const twitterUrl = owner?.twitter || "https://twitter.com/";
  const websiteUrl = owner?.website || "#";
  const email = owner?.email || "";
  const phone = owner?.phone || "";
  const name = owner?.name || "Portfolio Owner";

  // Create WhatsApp link if phone exists
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/\D/g, "")}`
    : null;

  // Create email link
  const emailUrl = email ? `mailto:${email}` : null;

  return (
    <footer className="bg-background border-t py-10 relative">
      <div className="px-4 flex flex-col items-center gap-10 container mx-auto">
        {/* --- Year and back-to-top --- */}
        <div className="flex justify-between w-full text-sm text-muted-foreground">
          <span>
            © {year} {name}
          </span>
          <a
            href="#top"
            className="flex items-center gap-1 hover:text-primary transition"
          >
            <span className="hidden sm:inline">BACK TO TOP</span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-background ml-2">
              <ArrowUp className="h-4 w-4" />
            </span>
          </a>
        </div>

        {/* --- Center Text --- */}
        <div className="space-y-6 text-center">
          <p className="uppercase text-xs tracking-widest text-muted-foreground">
            Have a project in mind?
          </p>

          <h2 className="text-6xl md:text-8xl font-bold text-muted-foreground/20 leading-none select-none">
            LET&apos;S TALK
          </h2>

          {/* --- Contact Buttons --- */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {/* Email */}
            {emailUrl && (
              <Link
                href={emailUrl}
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                Email
              </Link>
            )}

            {/* WhatsApp */}
            {whatsappUrl && (
              <Link
                href={whatsappUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                WhatsApp
              </Link>
            )}

            {/* GitHub */}
            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                GitHub
              </Link>
            )}

            {/* LinkedIn */}
            {linkedinUrl && (
              <Link
                href={linkedinUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                LinkedIn
              </Link>
            )}

            {/* Twitter */}
            {twitterUrl && (
              <Link
                href={twitterUrl}
                target="_blank"
                className="border px-6 py-2 rounded-full text-sm hover:bg-muted transition"
              >
                Twitter
              </Link>
            )}

            {/* Website */}
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

          {/* Contact Info */}
          {(email || phone) && (
            <div className="text-sm text-muted-foreground space-y-1">
              {email && (
                <div>
                  <strong>Email:</strong> {email}
                </div>
              )}
              {phone && (
                <div>
                  <strong>Phone:</strong> {phone}
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Bottom credits --- */}
        <div className="text-xs text-muted-foreground mt-4 space-x-1 text-center">
          <span>
            Design by{" "}
            <a
              href="https://avgy.design"
              target="_blank"
              className="underline hover:text-primary"
            >
              ASM Shad
            </a>
          </span>
          <span>•</span>
          <span>
            Development by{" "}
            <a
              href={githubUrl}
              target="_blank"
              className="underline hover:text-primary"
            >
              {name}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
