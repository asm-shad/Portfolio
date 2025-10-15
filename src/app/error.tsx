"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
      <Frown className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Something went wrong 😕</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try Again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
