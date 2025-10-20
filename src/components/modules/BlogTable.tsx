/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Calendar,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    picture: string | null;
    title: string | null;
  };
}

interface BlogTableProps {
  initialBlogs: any[]; // Use any[] for flexibility
}

export function BlogTable({ initialBlogs }: BlogTableProps) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<string>("");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    blogId: number | null;
    blogTitle: string;
  }>({
    isOpen: false,
    blogId: null,
    blogTitle: "",
  });

  const router = useRouter();

  // Initialize blogs with proper error handling
  useEffect(() => {
    if (Array.isArray(initialBlogs)) {
      setBlogs(initialBlogs);
    } else {
      console.error("initialBlogs is not an array:", initialBlogs);
      setBlogs([]);
    }
  }, [initialBlogs]);

  // Add this debug effect to see what's happening
  useEffect(() => {
    console.log("Blogs data:", blogs);
    console.log("Is blogs array?", Array.isArray(blogs));
    console.log("Blogs length:", blogs.length);
  }, [blogs]);

  // In your BlogTable component, replace the API calls with:

  const handlePublishToggle = async (
    blogId: number,
    currentStatus: boolean
  ) => {
    setLoading(`publish-${blogId}`);

    try {
      const base = process.env.NEXT_PUBLIC_BASE_API!;
      const endpoint = currentStatus ? "unpublish" : "publish";
      const url = `${base}/post/${blogId}/${endpoint}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This sends cookies
      });

      if (!response.ok) {
        throw new Error("Failed to update blog status");
      }

      // Update local state
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === blogId
            ? {
                ...blog,
                isPublished: !currentStatus,
                publishedAt: !currentStatus ? new Date().toISOString() : null,
              }
            : blog
        )
      );

      toast.success(
        `Blog ${!currentStatus ? "published" : "unpublished"} successfully`
      );
    } catch (error) {
      console.error("Error updating blog status:", error);
      toast.error("Failed to update blog status");
    } finally {
      setLoading("");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.blogId) return;

    setLoading(`delete-${deleteDialog.blogId}`);

    try {
      const base = process.env.NEXT_PUBLIC_BASE_API!;
      const url = `${base}/post/${deleteDialog.blogId}`;

      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include", // This sends cookies
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      // Remove from local state
      setBlogs((prev) =>
        prev.filter((blog) => blog.id !== deleteDialog.blogId)
      );

      toast.success("Blog deleted successfully");
      setDeleteDialog({ isOpen: false, blogId: null, blogTitle: "" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setLoading("");
    }
  };

  const openDeleteDialog = (blogId: number, blogTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      blogId,
      blogTitle,
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No blog posts yet</h3>
          <p className="text-muted-foreground">
            Get started by creating your first blog post.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/blogs/create">Create Your First Post</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="hover:text-primary hover:underline flex items-center gap-1"
                      >
                        {truncateText(blog.title, 50)}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                    {blog.excerpt && (
                      <p className="text-sm text-muted-foreground">
                        {truncateText(blog.excerpt, 80)}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={blog.isPublished ? "default" : "secondary"}
                    className={
                      blog.isPublished
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : ""
                    }
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={blog.isFeatured ? "default" : "outline"}>
                    {blog.isFeatured ? "Featured" : "Regular"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {blog.tags.slice(0, 2).map((tag: any, index: any) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{blog.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    {blog.views.toLocaleString()}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(blog.publishedAt)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(blog.createdAt)}
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/blogs/edit/${blog.id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          handlePublishToggle(blog.id, blog.isPublished)
                        }
                        disabled={loading === `publish-${blog.id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {blog.isPublished ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(blog.id, blog.title)}
                        disabled={loading === `delete-${blog.id}`}
                        className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setDeleteDialog({ isOpen: false, blogId: null, blogTitle: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post &ldquo;{deleteDialog.blogTitle}&ldquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading.startsWith("delete-")}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading.startsWith("delete-") ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
