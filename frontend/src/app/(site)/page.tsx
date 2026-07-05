import { Suspense } from "react";
import { HeroSearch } from "@/components/home/hero-search";
import { LatestJobs } from "@/components/home/latest-jobs";
import { CategorySections } from "@/components/home/category-sections";
import { TrendingJobs } from "@/components/home/trending-jobs";
import { PopularCompanies } from "@/components/home/popular-companies";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";

export const dynamic = "force-dynamic";

function JobsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <Suspense fallback={<JobsSkeleton />}>
        <LatestJobs />
      </Suspense>
      <Suspense fallback={<JobsSkeleton />}>
        <TrendingJobs />
      </Suspense>
      <Suspense fallback={<JobsSkeleton />}>
        <CategorySections />
      </Suspense>
      <Suspense fallback={null}>
        <PopularCompanies />
      </Suspense>
    </>
  );
}
