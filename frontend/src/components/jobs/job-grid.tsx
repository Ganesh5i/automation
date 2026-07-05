import type { Job } from "@/generated/prisma/client";
import { JobCard } from "@/components/jobs/job-card";
import { cn } from "@/lib/utils";

interface JobGridProps {
  jobs: Job[];
  className?: string;
}

export function JobGrid({ jobs, className }: JobGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} className="h-full" />
      ))}
    </div>
  );
}
