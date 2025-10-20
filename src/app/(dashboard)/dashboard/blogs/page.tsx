import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { BlogTable } from "@/components/modules/BlogTable";

export const metadata: Metadata = {
  title: "Manage Blogs",
  description: "Manage your blog posts",
};

async function getBlogs() {
  const base = process.env.NEXT_PUBLIC_BASE_API!;
  const url = `${base}/post`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 30,
        tags: ["blogs"],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    const data = await res.json();

    // Handle the nested response structure: data.data.data
    if (data.success && data.data && Array.isArray(data.data.data)) {
      return data.data.data; // Extract the actual blog array
    } else if (Array.isArray(data)) {
      return data; // Direct array response
    } else if (data.data && Array.isArray(data.data)) {
      return data.data; // Nested data array
    } else {
      console.warn("Unexpected API response structure:", data);
      return []; // Return empty array as fallback
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return []; // Return empty array on error
  }
}

export default async function BlogManagementPage() {
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage your blog posts, publish, unpublish, edit or delete them.
          </p>
        </div>

        <Button asChild>
          <Link
            href="/dashboard/blogs/create"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Blog Post
          </Link>
        </Button>
      </div>

      {/* Blog Table */}
      <BlogTable initialBlogs={blogs} />
    </div>
  );
}
