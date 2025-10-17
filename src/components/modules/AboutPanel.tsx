/* components/modules/AboutPanel.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import {
  Github,
  Globe,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import CoverRotator from "@/helpers/CoverRotator";

// NOTE: deterministic cover list
const COVERS = [
  "https://i.ibb.co.com/PzbMR7nq/shad-passport.jpg",
  "https://i.ibb.co.com/ns3CKV62/travel-register.jpg",
  "https://i.ibb.co.com/Kj0W9N16/travel-login.jpg",
  "https://i.ibb.co.com/35HXJ16w/nikolai-lehmann-65za6-Wl6-Rbw-unsplash.jpg",
  "https://i.ibb.co.com/vpgJcw0/ivan-diaz-t-Oa-d-Wr-Zgnk-unsplash.jpg",
  "https://i.ibb.co.com/0pGNbGm9/davies-designs-studio-kyvu-Ax-k-EDI-unsplash.jpg",
  "https://i.ibb.co.com/k28mvjnH/nikolai-lehmann-w-S7eko4-F2-O8-unsplash.jpg",
  "https://i.ibb.co.com/gFtCgHt4/Developer-Lab-Black-Minimalist-By-Thesamnite.jpg",
  "https://i.ibb.co.com/606xLrj9/4k-Programming-Wallpaper-1.jpg",
  "https://i.ibb.co.com/Bh4Kyys/4k-Programming-Wallpaper.jpg",
  "https://i.ibb.co.com/b5wnwFkV/Simple-Programming-Wallpaper-1.jpg",
  "https://i.ibb.co.com/fzWhhW68/Programming-4k-Wallpaper.png",
  "https://i.ibb.co.com/twsPt2bR/Simple-Programming-Wallpaper.jpg",
  "https://i.ibb.co.com/nMLZ5NJK/Papel-De-Parede-Programador-Web.jpg",
  "https://i.ibb.co.com/Y7dJQ4CK/Programming-HD-Wallpaper-For-Desktop.jpg",
];

// ✅ Build-time (SSG) fetch helper
export async function getOwnerSSG() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user`, {
    cache: "force-cache",
  });
  if (!res.ok) return null;
  const list = await res.json();
  const owner = Array.isArray(list)
    ? list.find((u: any) => u.role === "SUPER_ADMIN")
    : null;
  return owner ?? null;
}

// deterministic index (not URL) so we can pass a stable start to the rotator
function pickDeterministicCoverIndex(key: string) {
  let sum = 0;
  for (let i = 0; i < key.length; i++)
    sum = (sum + key.charCodeAt(i)) % 2147483647;
  return sum % COVERS.length;
}

export default function AboutPanel({ owner }: { owner: any | null }) {
  if (!owner) {
    return (
      <section className="rounded-2xl border bg-card/60 p-6 text-sm text-red-500">
        ❌ Owner profile not found.
      </section>
    );
  }

  const name = owner.name ?? "Portfolio Owner";
  const title = owner.title ?? "Full Stack Developer";
  const bio =
    owner.bio ??
    "Full Stack Developer focused on building fast, reliable, and accessible web apps with modern JavaScript, TypeScript, and cloud-native tooling.";
  const location = owner.location ?? "—";
  const email = owner.email ?? "—";
  const phone = owner.phone ?? "";
  const website = owner.website ?? "";
  const github = owner.github ?? "";
  const linkedin = owner.linkedin ?? "";
  const twitter = owner.twitter ?? "";
  const avatar = owner.picture ?? "/default-avatar.png";
  const skills: string[] = Array.isArray(owner.skills) ? owner.skills : [];
  const postsCount: number | undefined = owner._count?.posts;
  const projectsCount: number | undefined = owner._count?.projects;

  // deterministic start index for rotation
  const coverKey = owner.email || owner.name || "cover";
  const startIndex = pickDeterministicCoverIndex(coverKey);

  return (
    <section className="rounded-2xl border bg-card/60 overflow-hidden">
      {/* Cover (client-rotating) */}
      <div className="relative h-44 md:h-60">
        <CoverRotator covers={COVERS} initialIndex={startIndex} />
      </div>

      {/* Header: avatar + name overlapping the bottom of the cover */}
      <div className="px-5 md:px-8">
        <div className="relative -mt-12 md:-mt-14 z-10 flex items-end gap-4">
          <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full ring-2 ring-background overflow-hidden bg-muted shadow">
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          {/* The name pill straddles the cover edge */}
          <div className="pb-2">
            <div className="inline-block rounded-xl bg-background/80 backdrop-blur px-3 py-1.5 shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold leading-tight">
                {name}
              </h2>
            </div>
            <div className="mt-1 text-sm md:text-base text-muted-foreground">
              {title}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {typeof postsCount === "number" && (
            <span className="text-xs md:text-sm rounded-full border px-3 py-1">
              {postsCount} Posts
            </span>
          )}
          {typeof projectsCount === "number" && (
            <span className="text-xs md:text-sm rounded-full border px-3 py-1">
              {projectsCount} Projects
            </span>
          )}
          <div className="grow" />
          <div className="flex items-center gap-2">
            {website && (
              <Button asChild variant="outline" size="sm">
                <Link href={website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-1.5" /> Website
                </Link>
              </Button>
            )}
            {github && (
              <Button asChild variant="outline" size="sm">
                <Link href={github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-1.5" /> GitHub
                </Link>
              </Button>
            )}
            {linkedin && (
              <Button asChild variant="outline" size="sm">
                <Link href={linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-1.5" /> LinkedIn
                </Link>
              </Button>
            )}
            {twitter && (
              <Button asChild variant="outline" size="sm">
                <Link href={twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-1.5" /> X
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Separator className="mt-6" />

      {/* Bio */}
      <div className="px-5 md:px-8 py-6">
        <h3 className="text-base md:text-lg font-semibold">About Me</h3>
        <p className="text-sm md:text-base text-muted-foreground mt-2">{bio}</p>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <Separator />
          <div className="px-5 md:px-8 py-6">
            <h4 className="text-sm md:text-base font-semibold mb-3">
              Skills & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(skills)).map((s, i) => (
                <Badge
                  key={`${s}-${i}`}
                  variant="secondary"
                  className="text-[11px] px-2.5 py-1"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Contact */}
      <Separator />
      <div className="px-5 md:px-8 py-6 grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{location}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>{phone}</span>
          </div>
        )}
      </div>
    </section>
  );
}
