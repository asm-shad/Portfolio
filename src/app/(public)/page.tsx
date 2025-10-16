// app/page.tsx

import AboutPanel from "@/components/modules/AboutPanel";
import BlogPanel from "@/components/modules/BlogPanel";
import ProjectsPanel from "@/components/modules/ProjectsPanel";
import SidebarProfile from "@/components/modules/SidebarProfile";
import InnerNav from "@/components/shared/InnerNav";

export default async function Home({
  searchParams,
}: {
  searchParams?: { tab?: string; page?: string };
}) {
  const sp = await searchParams;
  const tab = sp?.tab ?? "projects";
  const page = Number(sp?.page ?? "1");

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT 1/3 */}
        <div className="lg:col-span-1">
          <SidebarProfile />
        </div>

        {/* RIGHT 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold">
              Full Stack Developer
            </h1>
            <p className="text-muted-foreground">
              I&apos;m a dreamer. I have to dream and reach for the stars, and
              if I miss a star then I grab a handful of clouds.
            </p>
          </div>

          {/* Tabs */}
          <InnerNav />

          {/* Panel */}
          <section className="pt-4">
            {tab === "projects" && <ProjectsPanel page={page} />}
            {tab === "blog" && <BlogPanel page={page} />}
            {tab === "about" && <AboutPanel />}
          </section>
        </div>
      </div>
    </main>
  );
}
