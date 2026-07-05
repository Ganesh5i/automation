import { Suspense } from "react";
import { db } from "@/lib/db";
import { JOBS_PER_PAGE } from "@/lib/constants";
import { JobGrid } from "@/components/jobs/job-grid";
import { JobFilters } from "@/components/jobs/job-filters";
import { EmptyState } from "@/components/search/empty-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { JobCategory } from "@/generated/prisma/client";

interface JobListingPageProps {
  title: string;
  description: string;
  category?: JobCategory;
  searchParams: Promise<{
    page?: string;
    location?: string;
    role?: string;
    experience?: string;
    jobType?: string;
  }>;
}

export async function JobListingPage({
  title,
  description,
  category,
  searchParams,
}: JobListingPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const location = params.location?.trim();
  const role = params.role?.trim();
  const experience = params.experience?.trim();
  const jobType = params.jobType?.trim();

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (role) where.role = { contains: role, mode: "insensitive" };
  if (experience) where.experience = { contains: experience, mode: "insensitive" };
  if (jobType) where.jobType = jobType;

  const [jobs, total] = await Promise.all([
    db.job.findMany({
      where,
      orderBy: { postedDate: "desc" },
      skip: (page - 1) * JOBS_PER_PAGE,
      take: JOBS_PER_PAGE,
    }),
    db.job.count({ where }),
  ]);

  const totalPages = Math.ceil(total / JOBS_PER_PAGE);

  function buildPageUrl(p: number) {
    const sp = new URLSearchParams();
    if (params.location) sp.set("location", params.location);
    if (params.role) sp.set("role", params.role);
    if (params.experience) sp.set("experience", params.experience);
    if (params.jobType) sp.set("jobType", params.jobType);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {total} {total === 1 ? "opportunity" : "opportunities"} found
        </p>
      </div>

      <Suspense fallback={null}>
        <JobFilters />
      </Suspense>

      {jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <JobGrid jobs={jobs} />
          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={buildPageUrl(page - 1)} />
                  </PaginationItem>
                )}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href={buildPageUrl(pageNum)}
                        isActive={pageNum === page}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={buildPageUrl(page + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
