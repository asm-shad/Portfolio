/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/helpers/rich-text-editor";

// Helper function to get cookies
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function CreatePostForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    tags: "",
    isFeatured: false,
    isPublished: false,
  });

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

    if (!session?.user) {
      toast.error("You must be logged in!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        authorId: session.user.id,
      };

      // Get access token from cookies
      const accessToken = getCookie("accessToken");

      if (!accessToken) {
        throw new Error("No access token found. Please log in again.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to create posts.");
        } else {
          throw new Error("Failed to create post");
        }
      }

      toast.success("Post created successfully!");
      router.push("/dashboard/blogs");
    } catch (err: any) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <Card className="max-w-6xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">Checking authentication...</div>
        </CardContent>
      </Card>
    );
  }

  // Show message if not authenticated
  if (status === "unauthenticated" || !session) {
    return (
      <Card className="max-w-6xl mx-auto">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Authentication Required
          </h3>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to create a post.
          </p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-6xl mx-auto shadow-lg border-slate-200">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-foreground">
          Create New Post
        </h2>
        <p className="text-sm text-muted-foreground">
          Create and publish your blog post
        </p>
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
              This image will be used as the main thumbnail in blog listings and
              social media previews.
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
              Write your post content. Use the toolbar for formatting, headings,
              lists, links, and more.
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
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full py-3 text-lg"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Post...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
