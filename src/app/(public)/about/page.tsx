// app/about/page.tsx
export const dynamic = "force-static"; // ✅ SSG
export const revalidate = false; // ensure no ISR here

import AboutPanel, { getOwnerSSG } from "@/components/modules/AboutPanel";

export default async function AboutPage() {
  const owner = await getOwnerSSG(); // purely static fetch
  return (
    <main className="container mx-auto px-4 py-6">
      <AboutPanel owner={owner} />
    </main>
  );
}
