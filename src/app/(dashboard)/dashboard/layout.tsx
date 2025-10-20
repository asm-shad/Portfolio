import { Suspense } from "react";
import { Sidebar } from "@/components/modules/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content with Suspense boundary */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Suspense fallback={<DashboardLoading />}>{children}</Suspense>
      </div>
    </div>
  );
}

// Loading component for dashboard
function DashboardLoading() {
  return (
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
  );
}
