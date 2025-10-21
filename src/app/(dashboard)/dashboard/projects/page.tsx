import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import { ProjectsTable } from "@/components/modules/ProjectsTable";

export const metadata: Metadata = {
  title: "Manage Projects",
  description: "Manage your projects",
};

const PAGE_SIZE = 10;

async function getProjects(page: number = 1) {
  const base = process.env.NEXT_PUBLIC_BASE_API!;
  const url = `${base}/project?page=${page}&limit=${PAGE_SIZE}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 30,
        tags: ["projects"],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.status}`);
    }

    const data = await res.json();

    console.log("API Response:", data); // Debug log

    // Handle the actual response structure: {data: [], total: number, page: number, limit: number}
    if (Array.isArray(data.data)) {
      return {
        projects: data.data,
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || PAGE_SIZE,
      };
    }
    // Fallback: if data is directly an array
    else if (Array.isArray(data)) {
      return {
        projects: data,
        total: data.length,
        page: 1,
        limit: PAGE_SIZE,
      };
    }
    // Fallback: if there's a nested data structure
    else if (data.data && Array.isArray(data.data.data)) {
      return {
        projects: data.data.data,
        total: data.data.total || 0,
        page: data.data.page || 1,
        limit: data.data.limit || PAGE_SIZE,
      };
    }
    // Fallback: if there's a success field
    else if (data.success && Array.isArray(data.data)) {
      return {
        projects: data.data,
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || PAGE_SIZE,
      };
    } else {
      console.warn("Unexpected API response structure:", data);
      return {
        projects: [],
        total: 0,
        page: 1,
        limit: PAGE_SIZE,
      };
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      projects: [],
      total: 0,
      page: 1,
      limit: PAGE_SIZE,
    };
  }
}

interface ProjectsManagementPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProjectsManagementPage({
  searchParams,
}: ProjectsManagementPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page || "1"));
  const { projects, total } = await getProjects(currentPage);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Project Management
          </h1>
          <p className="text-muted-foreground">
            Manage your projects, edit, delete or mark them as featured.
            {total > 0 && (
              <span className="block text-sm mt-1">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, total)} of {total} projects
              </span>
            )}
            {total === 0 && (
              <span className="block text-sm mt-1">
                No projects found. Create your first project to get started.
              </span>
            )}
          </p>
        </div>

        <Button asChild>
          <Link
            href="/dashboard/projects/create"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Projects Table */}
      <ProjectsTable initialProjects={projects} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
