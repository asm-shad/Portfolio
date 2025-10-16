/* eslint-disable @typescript-eslint/no-explicit-any */
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 6;

async function getProjects(page: number) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/project?page=${page}&limit=${PAGE_SIZE}`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // ISR
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Normalize common shapes to { items: any[], total: number }
function normalize(data: any) {
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  const total =
    typeof data?.total === "number"
      ? data.total
      : typeof data?.meta?.total === "number"
      ? data.meta.total
      : items.length;

  return { items, total };
}

export default async function ProjectsPanel({ page }: { page: number }) {
  const raw = await getProjects(page);

  // Fallback to dummy data if server not ready
  const fallback = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "Next.js + Tailwind + Prisma",
    },
    { id: 2, title: "E-Commerce Store", description: "MERN + Stripe" },
    { id: 3, title: "Chat App", description: "Socket.io real-time chat" },
  ];

  const { items, total } = raw
    ? normalize(raw)
    : { items: fallback, total: fallback.length };

  const itemsArr = Array.isArray(items) ? items : [];
  const totalPages = Math.max(
    1,
    Math.ceil((typeof total === "number" ? total : itemsArr.length) / PAGE_SIZE)
  );

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsArr.length > 0 ? (
          itemsArr.map((p: any) => (
            <div
              key={p.id ?? p.slug ?? Math.random()}
              className="rounded-2xl border p-4"
            >
              <div className="aspect-video rounded-lg bg-muted mb-3" />
              <div className="font-semibold">
                {p.title ?? "Untitled Project"}
              </div>
              <div className="text-sm opacity-70">{p.description ?? ""}</div>
            </div>
          ))
        ) : (
          <div className="opacity-60">No projects yet.</div>
        )}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
}
