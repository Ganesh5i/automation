import Link from "next/link";
import { db } from "@/lib/db";
import { JobGrid } from "@/components/jobs/job-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function LatestJobs() {
  const jobs = await db.job.findMany({
    orderBy: { postedDate: "desc" },
    take: 12,
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Latest Job Alerts</h2>
            <p className="text-muted-foreground mt-1">
              Fresh opportunities posted recently
            </p>
          </div>
          <Button variant="outline" nativeButton={false} render={<Link href="/jobs" />}>
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <JobGrid jobs={jobs} />
      </div>
    </section>
  );
}
