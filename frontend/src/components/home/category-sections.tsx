import Link from "next/link";
import { db } from "@/lib/db";
import { JobGrid } from "@/components/jobs/job-grid";
import { Button } from "@/components/ui/button";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { JobCategory } from "@/generated/prisma/client";
import { ArrowRight } from "lucide-react";

const SECTIONS: JobCategory[] = [
  "FRESHER",
  "INTERNSHIP",
  "REMOTE",
  "WORK_FROM_HOME",
  "OFF_CAMPUS",
  "EXPERIENCED",
];

export async function CategorySections() {
  const sections = await Promise.all(
    SECTIONS.map(async (category) => {
      const jobs = await db.job.findMany({
        where: { category },
        orderBy: { postedDate: "desc" },
        take: 4,
      });
      return { category, jobs };
    })
  );

  return (
    <div className="py-8">
      {sections.map(({ category, jobs }) => {
        const config = CATEGORY_CONFIG[category];
        if (jobs.length === 0) return null;

        return (
          <section key={category} className="py-12 border-t">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">{config.label}</h2>
                  <p className="text-muted-foreground mt-1">
                    {config.description}
                  </p>
                </div>
                <Button variant="ghost" nativeButton={false} render={<Link href={config.href} />}>
                  See all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <JobGrid jobs={jobs} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
