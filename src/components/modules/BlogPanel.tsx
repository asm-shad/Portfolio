/* eslint-disable @typescript-eslint/no-explicit-any */
// components/home-tabs/BlogPanel.tsx
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 6;

async function getBlogs(page: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/post?page=${page}&limit=${PAGE_SIZE}`,
    { next: { revalidate: 300 } } // ISR
  );
  if (!res.ok) return { items: [], total: 0 };
  return res.json();
}

export default async function BlogPanel({ page }: { page: number }) {
  const data = await getBlogs(page);
  const items = data.items ?? data; // adapt to your API shape
  const totalPages = Math.max(1, Math.ceil((data.total ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((b: any) => (
          <a
            key={b.id}
            href={`/blog/${b.slug}`}
            className="rounded-2xl border p-4 hover:shadow"
          >
            <div className="aspect-video rounded-lg bg-muted mb-3" />
            <div className="font-semibold">{b.title}</div>
            {b.excerpt && <div className="text-sm opacity-70">{b.excerpt}</div>}
          </a>
        ))}
        {items.length === 0 && (
          <div className="opacity-60">No blog posts yet.</div>
        )}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
}
