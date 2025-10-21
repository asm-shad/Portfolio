/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import TrackedBlogLink from "@/helpers/TrackedBlogLink";
import MotherPagination from "@/components/MotherPagination";
import { Metadata } from "next";

export const revalidate = 300; // ISR for the page shell

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "All Blogs",
  description: "Latest blog posts by ASM Shad.",
};

async function getBlogs(page: number) {
  const base = process.env.NEXT_PUBLIC_BASE_API!;
  const url = `${base}/post?page=${page}&limit=${PAGE_SIZE}&isPublished=true`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) return null;
  return res.json();
}

// Normalize your API shape -> { items, total }
function normalize(data: any): { items: any[]; total: number } {
  const payload = data?.data ?? data;
  const items = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload)
    ? payload
    : [];
  const total =
    typeof payload?.total === "number"
      ? payload.total
      : typeof data?.total === "number"
      ? data.total
      : items.length;

  return { items, total };
}

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

interface AllBlogsProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AllBlogs({ searchParams }: AllBlogsProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? "1"));

  const raw = await getBlogs(page);
  const { items, total } = raw ? normalize(raw) : { items: [], total: 0 };

  const list: any[] = Array.isArray(items) ? items : [];
  const totalPages = Math.max(
    1,
    Math.ceil((typeof total === "number" ? total : list.length) / PAGE_SIZE)
  );

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold">All Blogs</h1>
        <p className="text-muted-foreground">
          Latest posts and tutorials from my notebook.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length > 0 ? (
          list.map((b, idx) => {
            const key = String(b.slug ?? b.id ?? idx);
            const date = toDateLabel(b.publishedAt ?? b.createdAt);
            const tags: string[] = Array.isArray(b.tags) ? b.tags : [];

            return (
              <TrackedBlogLink
                href={`/blog/${b.slug ?? b.id}`}
                postId={b.id}
                key={key}
                className="group rounded-2xl border hover:shadow-sm transition overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {b.thumbnail ? (
                    <Image
                      src={b.thumbnail}
                      alt={b.title ?? "Blog thumbnail"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}

                  <div className="absolute left-2 top-2 flex gap-2">
                    {b.isFeatured ? (
                      <span className="rounded-full bg-primary/90 text-white text-[10px] px-2 py-1">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition">
                    {b.title ?? "Untitled"}
                  </h3>

                  {b.excerpt ? (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {b.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    {date ? <span>{date}</span> : null}
                    {typeof b.views === "number" ? (
                      <>
                        <span>•</span>
                        <span>{b.views} views</span>
                      </>
                    ) : null}
                  </div>

                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.from(new Set<string>(tags))
                        .slice(0, 3)
                        .map((t) => (
                          <span
                            key={t}
                            className="text-[11px] rounded-full border bg-muted/60 px-2 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </TrackedBlogLink>
            );
          })
        ) : (
          <div className="opacity-60">No blog posts yet.</div>
        )}
      </div>

      <div className="flex justify-center">
        <MotherPagination
          totalPages={totalPages}
          queryKey="page"
          extraParams={{ filter: "active" }}
        />
      </div>
    </main>
  );
}
