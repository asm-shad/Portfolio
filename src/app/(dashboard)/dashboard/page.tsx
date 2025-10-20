/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserSession } from "@/helpers/getUserSession";
import { cookies } from "next/headers";
import { Suspense } from "react";

// Lazy load the heavy stats fetching
async function getStats() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const base = process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:5000/api";

  const res = await fetch(`${base}/stats`, {
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    console.error("Failed to fetch stats:", res.status, res.statusText);
    return null;
  }

  const json = await res.json();
  return json?.data ?? null;
}

function fmtDate(s?: string) {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

// Lazy loaded dashboard content
async function DashboardContent() {
  const session = await getUserSession();

  if (!session) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Content Dashboard</h1>
          <p className="text-muted-foreground">
            Please log in to view dashboard data
          </p>
        </div>
      </div>
    );
  }

  const data = await getStats();

  const totals = data?.totals ?? { posts: 0, projects: 0 };
  const mostViewedTop = data?.mostViewed?.top ?? null;
  const mostViewedList = Array.isArray(data?.mostViewed?.list)
    ? data.mostViewed.list
    : [];
  const recentPosts = Array.isArray(data?.recentPosts) ? data.recentPosts : [];
  const recentProjects = Array.isArray(data?.recentProjects)
    ? data.recentProjects
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Content Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your content and analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totals.posts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totals.projects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Post</CardTitle>
          </CardHeader>
          <CardContent>
            {mostViewedTop ? (
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-16 rounded bg-muted overflow-hidden">
                  {mostViewedTop.thumbnail ? (
                    <Image
                      src={mostViewedTop.thumbnail}
                      alt={mostViewedTop.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="space-y-0.5">
                  <Link
                    href={`/blog/${mostViewedTop.slug ?? mostViewedTop.id}`}
                    className="font-medium hover:underline"
                  >
                    {mostViewedTop.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {mostViewedTop.views} views •{" "}
                    {fmtDate(mostViewedTop.createdAt)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Latest Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {recentPosts.length === 0 ? (
              <p className="text-muted-foreground">No posts yet</p>
            ) : (
              recentPosts.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b last:border-b-0 py-2"
                >
                  <Link
                    href={`/blog/${p.slug ?? p.id}`}
                    className="hover:underline truncate"
                  >
                    {p.title}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {fmtDate(p.createdAt)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {mostViewedList.length === 0 ? (
              <p className="text-muted-foreground">No data yet</p>
            ) : (
              mostViewedList.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b last:border-b-0 py-2"
                >
                  <Link
                    href={`/blog/${p.slug ?? p.id}`}
                    className="hover:underline truncate"
                  >
                    {p.title}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {p.views} views
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="grid lg:grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {recentProjects.length === 0 ? (
              <p className="text-muted-foreground">No projects yet</p>
            ) : (
              recentProjects.map((pr: any) => (
                <div
                  key={pr.id}
                  className="flex items-center justify-between border-b last:border-b-0 py-2"
                >
                  <span className="truncate">{pr.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {fmtDate(pr.createdAt)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main dashboard page with loading state
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 animate-pulse">
          {/* Header loading */}
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>

          {/* Stats cards loading */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6 space-y-3">
                <div className="h-5 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>

          {/* Tables loading */}
          <div className="grid lg:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
