export const dynamic = "force-static";
export const revalidate = false;

import AboutPanel, { getOwnerSSG } from "@/components/modules/AboutPanel";

export default async function AboutPage() {
  const owner = await getOwnerSSG();
  return (
    <main className="container mx-auto px-4 py-6">
      <AboutPanel owner={owner} />
    </main>
  );
}
