/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 6;

async function getProjects(page: number) {
  const url = `${process.env.NEXT_PUBLIC_BASE_API}/project?page=${page}&limit=${PAGE_SIZE}`;
  const res = await fetch(url, { next: { revalidate: 3 } });
  if (!res.ok) return null;
  return res.json();
}

// Normalize common API shapes -> { items, total }
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
  const { items, total } = raw ? normalize(raw) : { items: [], total: 0 };

  const list: any[] = Array.isArray(items) ? items : [];
  const totalPages = Math.max(
    1,
    Math.ceil((typeof total === "number" ? total : list.length) / PAGE_SIZE)
  );

  return (
    <div className="space-y-6">
      {/* --- Projects Grid --- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length > 0 ? (
          list.map((p, idx) => {
            const key = p.id ?? p.slug ?? idx;
            return (
              <Link
                href={`/projects/${p.id}`} // ✅ details route
                key={key}
                className="group rounded-2xl border hover:shadow-sm transition overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {p.thumbnail ? (
                    <Image
                      src={p.thumbnail}
                      alt={p.title ?? "Project thumbnail"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}

                  {/* Labels */}
                  <div className="absolute left-2 top-2 flex gap-2">
                    {p.featured ? (
                      <span className="rounded-full bg-primary/90 text-white text-[10px] px-2 py-1">
                        Featured
                      </span>
                    ) : null}
                    {p.status ? (
                      <span className="rounded-full bg-background/80 backdrop-blur text-[10px] px-2 py-1 border capitalize">
                        {String(p.status).toLowerCase()}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition">
                    {p.title ?? "Untitled Project"}
                  </h3>
                  {p.description ? (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="opacity-60">No projects yet.</div>
        )}
      </div>

      {/* --- Pagination & All Projects Button --- */}
      <div className="flex items-center justify-between">
        <Pagination totalPages={totalPages} />
        <Link href="/projects">
          <Button variant="outline">All Projects</Button>
        </Link>
      </div>
    </div>
  );
}
