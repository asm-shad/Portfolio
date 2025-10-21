/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { RichTextEditor } from "@/helpers/rich-text-editor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  slug: string;
  authorId: number;
}

export default function EditBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    tags: "",
    isFeatured: false,
    isPublished: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch blog data with useCallback to avoid infinite re-renders
  const fetchBlog = useCallback(async () => {
    if (status !== "authenticated" || !session) {
      return;
    }

    try {
      const base = process.env.NEXT_PUBLIC_BASE_API!;
      const url = `${base}/post/${blogId}`;

      const response = await fetch(url, {
        credentials: "include", // This sends cookies including the session
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please login again");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch blog");
      }

      const blogData = await response.json();
      const blog = blogData.data;

      setBlog(blog);
      setForm({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        thumbnail: blog.thumbnail || "",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
        isFeatured: blog.isFeatured || false,
        isPublished: blog.isPublished || false,
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  }, [blogId, session, status, router]);

  // Fetch blog when component mounts or dependencies change
  useEffect(() => {
    if (status === "authenticated") {
      fetchBlog();
    }
  }, [fetchBlog, status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content: string) => {
    setForm((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated" || !session || !blog) {
      toast.error("You must be logged in!");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
      };

      const base = process.env.NEXT_PUBLIC_BASE_API!;
      const url = `${base}/post/${blogId}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This sends cookies including the session
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please login again");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to edit this blog");
        } else if (response.status === 404) {
          throw new Error("Blog not found");
        } else {
          throw new Error(`Failed to update blog: ${response.status}`);
        }
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Blog updated successfully!");
        router.push("/dashboard/blogs");
      } else {
        throw new Error(result.message || "Failed to update blog");
      }
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Please login to continue</h1>
        <Button asChild className="mt-4">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Blog not found</h1>
        <Button asChild className="mt-4">
          <Link href="/dashboard/blogs">Back to Blogs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/blogs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground">Update your blog post details</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-6xl mx-auto shadow-lg border-slate-200">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-foreground">
            Edit Post: {blog.title}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-base font-medium">
                Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter a compelling post title"
                className="mt-2"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt" className="text-base font-medium">
                Excerpt
              </Label>
              <Input
                id="excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Brief summary that appears in blog listings"
                className="mt-2"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <Label htmlFor="thumbnail" className="text-base font-medium">
                Featured Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/featured-image.jpg"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                This image will be used as the main thumbnail in blog listings
                and social media previews.
              </p>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-base font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="react, javascript, web-development, programming"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Separate tags with commas. These help with SEO and content
                discovery.
              </p>
            </div>

            {/* Content */}
            <div>
              <Label className="text-base font-medium block mb-3">
                Content *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Write your post content. Use the toolbar for formatting,
                headings, lists, links, and more.
              </p>
              <RichTextEditor
                value={form.content}
                onChange={handleContentChange}
                height={400}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="isFeatured"
                  checked={form.isFeatured}
                  onCheckedChange={(val) =>
                    setForm({ ...form, isFeatured: Boolean(val) })
                  }
                />
                <Label htmlFor="isFeatured" className="text-base font-medium">
                  Featured Post
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="isPublished"
                  checked={form.isPublished}
                  onCheckedChange={(val) =>
                    setForm({ ...form, isPublished: Boolean(val) })
                  }
                />
                <Label htmlFor="isPublished" className="text-base font-medium">
                  Publish Immediately
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex gap-4">
              <Button
                type="submit"
                className="flex-1 py-3 text-lg"
                disabled={saving}
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Updating Post...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Post
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/blogs")}
                className="py-3 text-lg"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
