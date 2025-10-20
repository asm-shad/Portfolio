/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/helpers/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Project status options
const PROJECT_STATUS = [
  { value: "COMPLETED", label: "Completed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "PLANNED", label: "Planned" },
];

export default function CreateProjectForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail: "",
    images: [] as string[],
    technologies: [] as string[],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    status: "COMPLETED",
    startDate: "",
    endDate: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [currentTech, setCurrentTech] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content: string) => {
    setForm((prev) => ({ ...prev, content }));
  };

  const addImage = () => {
    if (currentImage.trim() && !form.images.includes(currentImage.trim())) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, currentImage.trim()],
      }));
      setCurrentImage("");
    }
  };

  const removeImage = (imageToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageToRemove),
    }));
  };

  const addTechnology = () => {
    if (currentTech.trim() && !form.technologies.includes(currentTech.trim())) {
      setForm((prev) => ({
        ...prev,
        technologies: [...prev.technologies, currentTech.trim()],
      }));
      setCurrentTech("");
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tech) => tech !== techToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return toast.error("You must be logged in!");

    setLoading(true);
    try {
      const payload = {
        ...form,
        authorId: session.user.id,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API}/project`, payload, {
        withCredentials: true,
      });

      toast.success("Project created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-white shadow-lg border border-slate-200">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-slate-800">
          Create New Project
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Project Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter project title"
              className="mt-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Short Description *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of your project"
              className="mt-2 min-h-[100px]"
              required
            />
          </div>

          {/* Thumbnail */}
          <div>
            <Label htmlFor="thumbnail" className="text-base font-medium">
              Thumbnail URL
            </Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Main thumbnail image for the project.
            </p>
          </div>

          {/* Project Images */}
          <div>
            <Label className="text-base font-medium block mb-3">
              Project Images
            </Label>
            <div className="flex gap-2 mb-3">
              <Input
                value={currentImage}
                onChange={(e) => setCurrentImage(e.target.value)}
                placeholder="Add image URL"
                className="flex-1"
              />
              <Button type="button" onClick={addImage} variant="outline">
                Add
              </Button>
            </div>
            {form.images.length > 0 && (
              <div className="space-y-2">
                {form.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
                    <div className="flex-1 text-sm truncate">{image}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(image)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technologies */}
          <div>
            <Label className="text-base font-medium block mb-3">
              Technologies Used
            </Label>
            <div className="flex gap-2 mb-3">
              <Input
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                placeholder="Add technology (e.g., React, Node.js)"
                className="flex-1"
              />
              <Button type="button" onClick={addTechnology} variant="outline">
                Add
              </Button>
            </div>
            {form.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* URLs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="githubUrl" className="text-base font-medium">
                GitHub URL
              </Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="liveUrl" className="text-base font-medium">
                Live Demo URL
              </Label>
              <Input
                id="liveUrl"
                name="liveUrl"
                value={form.liveUrl}
                onChange={handleChange}
                placeholder="https://your-project.com"
                className="mt-2"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-base font-medium">
                Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-base font-medium">
                End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className="text-base font-medium">
              Project Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div>
            <Label className="text-base font-medium block mb-3">
              Project Details
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Detailed description of your project, features, challenges, etc.
            </p>
            <RichTextEditor
              value={form.content}
              onChange={handleContentChange}
              height={300}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="featured"
                checked={form.featured}
                onCheckedChange={(val) =>
                  setForm({ ...form, featured: Boolean(val) })
                }
              />
              <Label htmlFor="featured" className="text-base font-medium">
                Featured Project
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
                  Creating Project...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
