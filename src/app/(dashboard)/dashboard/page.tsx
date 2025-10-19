/* eslint-disable @typescript-eslint/no-explicit-any */
/* app/dashboard/page.tsx */
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserSession } from "@/helpers/getUserSession";

async function getStats() {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const res = await fetch(`${base}/stats`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
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

export default async function DashboardPage() {
  const session = await getUserSession();
  console.log(session);

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

      {/* Stat cards */}
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
