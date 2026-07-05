import { db } from "@/lib/db";
import { JobGrid } from "@/components/jobs/job-grid";
import type { Job } from "@/generated/prisma/client";

interface RelatedJobsProps {
  job: Job;
}

export async function RelatedJobs({ job }: RelatedJobsProps) {
  const related = await db.job.findMany({
    where: {
      id: { not: job.id },
      OR: [
        { category: job.category },
        { companyName: job.companyName },
      ],
    },
    orderBy: { postedDate: "desc" },
    take: 4,
  });

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t">
      <h2 className="text-2xl font-bold mb-6">Related Jobs</h2>
      <JobGrid jobs={related} />
    </section>
  );
}
