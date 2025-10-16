/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MotherPagination from "@/components/MotherPagination";

export const revalidate = 300; // ISR enabled (revalidates every 5 minutes)
const PAGE_SIZE = 12;

async function getProjects(page: number) {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const url = `${base}/project?page=${page}&limit=${PAGE_SIZE}`;
  const res = await fetch(url, { next: { revalidate: 3 } }); // ISR fetch
  if (!res.ok) return null;
  return res.json();
}

// Normalize various API response shapes
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

export default async function AllProjects({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams?.page ?? "1"));
  const raw = await getProjects(page);
  const { items, total } = raw ? normalize(raw) : { items: [], total: 0 };

  const list: any[] = Array.isArray(items) ? items : [];
  const totalPages = Math.max(
    1,
    Math.ceil((typeof total === "number" ? total : list.length) / PAGE_SIZE)
  );

  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      {/* Page header */}
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold">All Projects</h1>
        <p className="text-muted-foreground">
          Explore my personal projects — from experiments to production-ready
          apps.
        </p>
      </header>

      {/* Projects grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length > 0 ? (
          list.map((p, idx) => {
            const key = p.id ?? p.slug ?? idx;
            return (
              <Link
                href={`/projects/${p.id}`}
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
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition">
                    {p.title ?? "Untitled Project"}
                  </h3>

                  {p.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                  ) : null}

                  {/* Technology badges */}
                  {Array.isArray(p.technologies) &&
                    p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.technologies
                          .slice(0, 3)
                          .map((tech: string, i: number) => (
                            <span
                              key={`${tech}-${i}`}
                              className="text-[11px] rounded-full border bg-muted/60 px-2 py-0.5"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                    )}

                  {/* Links */}
                  <div className="flex gap-2 pt-3">
                    {p.liveUrl && (
                      <Link
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          Live
                        </Button>
                      </Link>
                    )}
                    {p.githubUrl && (
                      <Link
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          GitHub
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="opacity-60">No projects available yet.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <MotherPagination
          totalPages={totalPages}
          queryKey="page"
          basePath="/dashboard/projects"
          extraParams={{ filter: "active" }}
        />
      </div>
    </main>
  );
}
