/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Mail, MapPin, Send } from "lucide-react";

async function getSuperAdmin() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const users = await res.json();
    return Array.isArray(users)
      ? users.find((u: any) => u.role === "SUPER_ADMIN")
      : null;
  } catch {
    return null;
  }
}

export default async function SidebarProfile() {
  const owner = await getSuperAdmin();

  if (!owner) {
    return (
      <aside className="rounded-2xl border bg-card/60 p-6 text-center text-sm text-red-500">
        ❌ Failed to load admin profile
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border bg-card/60 shadow-sm p-8 md:p-10 sticky top-20 min-h-[600px] md:min-h-[700px] flex flex-col justify-between">
      {/* --- Top Section (Profile Info + Skills) --- */}
      <div>
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center">
          <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden bg-muted ring-1 ring-border shadow-sm">
            <Image
              src={owner.picture ?? "/default-avatar.png"}
              alt={owner.name ?? "Profile picture"}
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>

          <h2 className="mt-4 text-xl md:text-2xl font-semibold">
            {owner.name}
          </h2>

          <a
            href="#contact"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-xs md:text-sm font-medium text-white hover:bg-black/85 transition"
          >
            <Send className="h-3.5 w-3.5" />
            Get In Touch
          </a>
        </div>

        {/* Skills Section */}
        {Array.isArray(owner.skills) && owner.skills.length > 0 && (
          <div className="mt-8">
            <div className="text-[10px] md:text-xs font-semibold text-muted-foreground tracking-wide">
              SKILLS &amp; TOOLS
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {owner.skills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-block rounded-full border bg-muted/70 px-3 py-1 text-xs text-foreground/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- Bottom Section (Contact) --- */}
      <div
        id="contact"
        className="pt-6 mt-12 border-t border-border text-sm text-center md:text-left"
      >
        <div className="text-[10px] md:text-xs font-semibold text-muted-foreground tracking-wide mb-3 uppercase">
          Contact
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="truncate">{owner.email}</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{owner.location ?? "Dhaka, Bangladesh"}</span>
          </div>
          {owner.phone && (
            <div className="flex items-center justify-center md:justify-start gap-2">
              📞 <span>{owner.phone}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
