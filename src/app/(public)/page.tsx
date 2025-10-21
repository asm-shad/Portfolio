import { Suspense } from "react";
import dynamic from "next/dynamic";
import SidebarProfile from "@/components/modules/SidebarProfile";
import InnerNav from "@/components/shared/InnerNav";

// Lazy load the heavy components
const AboutSummary = dynamic(
  () => import("@/components/modules/AboutSummary"),
  {
    loading: () => (
      <div className="rounded-2xl border bg-card/60 p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    ),
  }
);

const BlogPanel = dynamic(() => import("@/components/modules/BlogPanel"), {
  loading: () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      ))}
    </div>
  ),
});

const ProjectsPanel = dynamic(
  () => import("@/components/modules/ProjectsPanel"),
  {
    loading: () => (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    ),
  }
);

// Component for the main content area
function TabContent({ tab, page }: { tab: string; page: number }) {
  return (
    <section className="pt-4">
      {tab === "projects" && <ProjectsPanel page={page} />}
      {tab === "blog" && <BlogPanel page={page} />}
      {tab === "about" && <AboutSummary />}
    </section>
  );
}

interface HomeProps {
  searchParams: Promise<{ tab?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const tab = params?.tab ?? "projects";
  const page = Number(params?.page ?? "1");

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT 1/3 - Sidebar */}
        <div className="lg:col-span-1">
          <Suspense
            fallback={
              <div className="rounded-2xl border bg-card/60 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            }
          >
            <SidebarProfile />
          </Suspense>
        </div>

        {/* RIGHT 2/3 - Main Content */}
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

          {/* Panel with Suspense boundary */}
          <Suspense
            fallback={
              <div className="pt-4 space-y-4 animate-pulse">
                <div className="h-8 bg-muted rounded w-1/4"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            }
          >
            <TabContent tab={tab} page={page} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
