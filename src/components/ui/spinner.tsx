import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // optional helper if you use shadcn

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("h-5 w-5 animate-spin text-primary", className)} />
  );
}
