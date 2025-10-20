/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
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
    `${process.env.NEXT_PUBLIC_BASE_API}/post/slug/${slug}`,
    {
      next: { revalidate: 30 },
    }
  );
  if (!res.ok) {
    console.error("❌ Blog fetch failed:", res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  console.log("✅ Blog fetched:", data);

  // normalize in case API returns { success, data: {...} }
  if (data?.data) return data.data;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/post/slug/${slug}`,
    { next: { revalidate: 30 } }
  );

  if (!res.ok) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const data = await res.json();
  // ✅ define blog outside, normalize it cleanly
  const blog = data?.data ?? data;

  // ✅ add safe fallbacks
  const title = blog?.title ?? "Blog Post";
  const description =
    blog?.excerpt ??
    (blog?.content ? blog.content.slice(0, 160) : "Read this blog post.");
  const image = blog?.thumbnail ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
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

export default async function BlogDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    console.warn("❌ Blog not found for slug:", slug);
    notFound();
  }

  const {
    title,
    content,
    excerpt,
    thumbnail,
    tags = [],
    isFeatured,
    isPublished,
    views,
    author,
    createdAt,
    publishedAt,
  } = blog as any;

  const date = toDateLabel(publishedAt ?? createdAt);

  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {isFeatured && (
            <span className="rounded-full bg-primary text-white text-[11px] px-2 py-0.5">
              Featured
            </span>
          )}
          {!isPublished && (
            <span className="rounded-full border text-[11px] px-2 py-0.5">
              Draft
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
        {excerpt && <p className="text-muted-foreground">{excerpt}</p>}

        {author && (
          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-muted">
              {author.picture && (
                <Image
                  src={author.picture}
                  alt={author.name ?? "Author"}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium">{author.name ?? "Author"}</div>
              {author.title && (
                <div className="text-muted-foreground">{author.title}</div>
              )}
            </div>
            <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
              {date && <span>{date}</span>}
              {typeof views === "number" && (
                <>
                  <span>•</span>
                  <span>{views} views</span>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {thumbnail && (
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
      )}

      {tags?.length > 0 && (
        <section>
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t: string) => (
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

      {content ? (
        <article>
          <HtmlContent content={content} />
        </article>
      ) : (
        <p className="opacity-60">No content available for this blog.</p>
      )}

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
