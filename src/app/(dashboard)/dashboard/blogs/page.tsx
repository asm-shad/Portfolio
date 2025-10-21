import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { BlogTable } from "@/components/modules/BlogTable";
import MotherPagination from "@/components/MotherPagination";

export const metadata: Metadata = {
  title: "Manage Blogs",
  description: "Manage your blog posts",
};

const PAGE_SIZE = 10;

async function getBlogs(page: number = 1) {
  const base = process.env.NEXT_PUBLIC_BASE_API!;
  const url = `${base}/post?page=${page}&limit=${PAGE_SIZE}`;

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

    // Handle the nested response structure: data.data
    if (data.success && data.data) {
      return {
        blogs: Array.isArray(data.data.data) ? data.data.data : [],
        total: data.data.total || 0,
        page: data.data.page || 1,
        limit: data.data.limit || PAGE_SIZE,
      };
    } else if (Array.isArray(data)) {
      return {
        blogs: data,
        total: data.length,
        page: 1,
        limit: PAGE_SIZE,
      };
    } else {
      console.warn("Unexpected API response structure:", data);
      return {
        blogs: [],
        total: 0,
        page: 1,
        limit: PAGE_SIZE,
      };
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      blogs: [],
      total: 0,
      page: 1,
      limit: PAGE_SIZE,
    };
  }
}

export default async function BlogManagementPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Math.max(1, Number(searchParams.page || "1"));
  const { blogs, total } = await getBlogs(currentPage);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage your blog posts, publish, unpublish, edit or delete them.
            {total > 0 && (
              <span className="block text-sm mt-1">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, total)} of {total} posts
              </span>
            )}
          </p>
        </div>

        <Button asChild>
          <Link
            href="/dashboard/create-blog"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Blog Post
          </Link>
        </Button>
      </div>

      {/* Blog Table */}
      <BlogTable initialBlogs={blogs} />

      {/* Pagination */}
      {totalPages > 1 && (
        <MotherPagination totalPages={totalPages} queryKey="page" />
      )}
    </div>
  );
}
