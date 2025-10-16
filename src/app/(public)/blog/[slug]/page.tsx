/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

async function getBlog(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/post/slug/${slug}`,
    { next: { revalidate: 300 } } // ISR
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const {
    title,
    content,
    excerpt,
    thumbnail,
    tags,
    isFeatured,
    isPublished,
    views,
    author,
    createdAt,
    updatedAt,
    publishedAt,
  } = blog as any;

  const date = toDateLabel(publishedAt ?? createdAt);
  const tagList: string[] = Array.isArray(tags) ? tags : [];

  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {isFeatured ? (
            <span className="rounded-full bg-primary text-white text-[11px] px-2 py-0.5">
              Featured
            </span>
          ) : null}
          {isPublished ? null : (
            <span className="rounded-full border text-[11px] px-2 py-0.5">
              Draft
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>

        {excerpt ? <p className="text-muted-foreground">{excerpt}</p> : null}

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
            <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
              {date ? <span>{date}</span> : null}
              {typeof views === "number" ? (
                <>
                  <span>•</span>
                  <span>{views} views</span>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      {/* Thumbnail */}
      {thumbnail ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
          <Image
            src={thumbnail}
            alt={title ?? "Blog thumbnail"}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {/* Tags */}
      {tagList.length > 0 && (
        <section className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
            Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set<string>(tagList)).map((t) => (
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

      {/* Content */}
      {content ? (
        <article className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
          <p>{content}</p>
        </article>
      ) : null}

      {/* Back link */}
      <div className="pt-4">
        <Link
          href="/?tab=blog"
          className="text-primary hover:underline text-sm"
        >
          ← Back to blog
        </Link>
      </div>
    </main>
  );
}
