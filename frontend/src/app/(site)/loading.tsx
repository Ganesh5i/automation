import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
