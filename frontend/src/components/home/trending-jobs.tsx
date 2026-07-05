import Link from "next/link";
import { db } from "@/lib/db";
import { JobGrid } from "@/components/jobs/job-grid";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export async function TrendingJobs() {
  const jobs = await db.job.findMany({
    where: { trending: true },
    orderBy: { postedDate: "desc" },
    take: 6,
  });

  if (jobs.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Trending Jobs</h2>
            <p className="text-muted-foreground mt-1">
              Most popular opportunities right now
            </p>
          </div>
        </div>
        <JobGrid jobs={jobs} className="lg:grid-cols-3" />
        <div className="text-center mt-8">
          <Button variant="outline" nativeButton={false} render={<Link href="/jobs" />}>
            Explore More Jobs
          </Button>
        </div>
      </div>
    </section>
  );
}
