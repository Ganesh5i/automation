"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Job } from "@/generated/prisma/client";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/jobs?perPage=100")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.role.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase()) ||
      j.searchCode.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Delete this job?")) return;
    const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success("Job deleted");
    } else {
      toast.error("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <Button nativeButton={false} render={<Link href="/admin/jobs/new" />}>
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </div>

      <Input
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm mb-6"
      />

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono text-xs">{job.searchCode}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {job.role}
                  </TableCell>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {job.category.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {job.featured && <Badge>Featured</Badge>}
                      {job.trending && <Badge variant="secondary">Trending</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        nativeButton={false}
                        render={<Link href={`/admin/jobs/${job.id}/edit`} />}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
