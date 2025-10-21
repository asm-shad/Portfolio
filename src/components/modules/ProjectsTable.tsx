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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  Calendar,
  Code,
} from "lucide-react";
import Link from "next/link";

interface ProjectsTableProps {
  initialProjects: any[];
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<string>("");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    projectId: number | null;
    projectTitle: string;
  }>({
    isOpen: false,
    projectId: null,
    projectTitle: "",
  });

  useEffect(() => {
    if (Array.isArray(initialProjects)) {
      setProjects(initialProjects);
    } else {
      console.error("initialProjects is not an array:", initialProjects);
      setProjects([]);
    }
  }, [initialProjects]);

  const handleFeaturedToggle = async (
    projectId: number,
    currentFeatured: boolean
  ) => {
    setLoading(`featured-${projectId}`);

    try {
      const base = process.env.NEXT_PUBLIC_BASE_API!;
      const url = `${base}/project/${projectId}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          featured: !currentFeatured,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Update local state
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                featured: !currentFeatured,
              }
            : project
        )
      );

      toast.success(
        `Project ${
          !currentFeatured ? "marked as featured" : "unfeatured"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setLoading("");
    }
  };

  const handleStatusChange = async (projectId: number, newStatus: string) => {
    setLoading(`status-${projectId}`);

    try {
      const base = process.env.NEXT_PUBLIC_BASE_API!;
      const url = `${base}/project/${projectId}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project status");
      }

      // Update local state
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                status: newStatus,
              }
            : project
        )
      );

      toast.success("Project status updated successfully");
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    } finally {
      setLoading("");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.projectId) return;

    setLoading(`delete-${deleteDialog.projectId}`);

    try {
      const base = process.env.NEXT_PUBLIC_BASE_API!;
      const url = `${base}/project/${deleteDialog.projectId}`;

      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Remove from local state
      setProjects((prev) =>
        prev.filter((project) => project.id !== deleteDialog.projectId)
      );

      toast.success("Project deleted successfully");
      setDeleteDialog({ isOpen: false, projectId: null, projectTitle: "" });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setLoading("");
    }
  };

  const openDeleteDialog = (projectId: number, projectTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      projectId,
      projectTitle,
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "planned":
        return "outline";
      case "on_hold":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No projects yet</h3>
          <p className="text-muted-foreground">
            Get started by creating your first project.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/projects/create">
              Create Your First Project
            </Link>
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
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Links</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {truncateText(project.description, 50)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <Badge
                      variant={getStatusBadgeVariant(project.status)}
                      className="capitalize"
                    >
                      {project.status?.replace("_", " ") || "Unknown"}
                    </Badge>
                    <div className="flex flex-col gap-1 mt-1">
                      <select
                        value={project.status}
                        onChange={(e) =>
                          handleStatusChange(project.id, e.target.value)
                        }
                        disabled={loading === `status-${project.id}`}
                        className="text-xs border rounded px-1 py-0.5 bg-background"
                      >
                        <option value="PLANNED">Planned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ON_HOLD">On Hold</option>
                      </select>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {project.technologies
                      ?.slice(0, 3)
                      .map((tech: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Code className="h-3 w-3 mr-1" />
                          {tech}
                        </Badge>
                      ))}
                    {project.technologies?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    {project.liveUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-7 justify-start"
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-7 justify-start"
                      >
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs"
                        >
                          <Github className="h-3 w-3" />
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      Start: {formatDate(project.startDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      End: {formatDate(project.endDate)}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={project.featured}
                      onCheckedChange={() =>
                        handleFeaturedToggle(project.id, project.featured)
                      }
                      disabled={loading === `featured-${project.id}`}
                    />
                    <Label className="text-sm">
                      {project.featured ? "Featured" : "Regular"}
                    </Label>
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
                          href={`/dashboard/projects/edit/${project.id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          openDeleteDialog(project.id, project.title)
                        }
                        disabled={loading === `delete-${project.id}`}
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
          setDeleteDialog({ isOpen: false, projectId: null, projectTitle: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project &ldquo;{deleteDialog.projectTitle}&rdquo;.
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
