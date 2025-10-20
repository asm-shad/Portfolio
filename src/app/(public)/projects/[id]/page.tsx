/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

// --- helpers ---
function toDateLabel(s?: string | null) {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Some rows contain two URLs glued together; try to split & validate.
function sanitizeImages(raw: any): string[] {
  const arr = Array.isArray(raw) ? raw : [];
  const out: string[] = [];
  const urlRe = /https?:\/\/[^\s"']+/g;

  for (const entry of arr) {
    if (typeof entry !== "string") continue;
    const matches = entry.match(urlRe);
    if (matches) out.push(...matches);
  }

  // Deduplicate while preserving order
  return Array.from(new Set(out));
}

async function getProject(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project/${id}`, {
    next: { revalidate: 30 }, // ISR
  });
  if (!res.ok) return null;
  return res.json();
}

// HTML Content Component (Server Component)
function HtmlContent({ content }: { content: string }) {
  return (
    <div
      className="prose prose-sm md:prose-base max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const {
    title,
    description,
    content,
    thumbnail,
    technologies,
    githubUrl,
    liveUrl,
    featured,
    status,
    startDate,
    endDate,
    createdAt,
    updatedAt,
    author,
    images,
  } = project as any;

  const techs: string[] = Array.isArray(technologies) ? technologies : [];
  const gallery = sanitizeImages(images);
  const started = toDateLabel(startDate);
  const ended = toDateLabel(endDate);
  const created = toDateLabel(createdAt);
  const updated = toDateLabel(updatedAt);

  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      {/* Title + Meta */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {featured ? (
            <span className="rounded-full bg-primary text-white text-[11px] px-2 py-0.5">
              Featured
            </span>
          ) : null}
          {status ? (
            <span className="rounded-full border text-[11px] px-2 py-0.5 capitalize">
              {String(status).toLowerCase()}
            </span>
          ) : null}
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>

        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}

        {/* Author */}
        {author ? (
          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-muted">
              {author.picture ? (
                <Image
                  src={author.picture}
                  alt={author.name ?? "Author"}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="text-sm">
              <div className="font-medium leading-tight">
                {author.name ?? "Author"}
              </div>
              {author.title ? (
                <div className="text-muted-foreground leading-tight">
                  {author.title}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      {/* Hero Thumbnail */}
      {thumbnail ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
          <Image
            src={thumbnail}
            alt={title ?? "Project thumbnail"}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {/* Links / Meta row */}
      <section className="flex flex-wrap items-center gap-3">
        {liveUrl ? (
          <Link
            href={liveUrl}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Live <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        {githubUrl ? (
          <Link
            href={githubUrl}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Source <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}

        <div className="ml-auto text-xs text-muted-foreground flex flex-wrap gap-3">
          {started ? <span>Start: {started}</span> : null}
          {ended ? <span>End: {ended}</span> : null}
          {created ? <span>Created: {created}</span> : null}
          {updated ? <span>Updated: {updated}</span> : null}
        </div>
      </section>

      {/* Technologies */}
      {techs.length > 0 && (
        <section className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
            Technologies
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set<string>(techs)).map((t) => (
              <span
                key={t}
                className="text-[11px] rounded-full border bg-muted/60 px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
            Gallery
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-video rounded-lg overflow-hidden bg-muted"
              >
                <Image
                  src={src}
                  alt={`${title ?? "Project"} ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content */}
      {content ? (
        <section>
          <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-2">
            Overview
          </div>
          <article>
            <HtmlContent content={content} />
          </article>
        </section>
      ) : null}
    </main>
  );
}
