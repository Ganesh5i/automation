import Link from "next/link";
import { db } from "@/lib/db";
import { StatsCards } from "@/components/admin/stats-cards";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalJobs, featuredJobs, trendingJobs, totalCompanies, categoryCounts] =
    await Promise.all([
      db.job.count(),
      db.job.count({ where: { featured: true } }),
      db.job.count({ where: { trending: true } }),
      db.company.count(),
      db.job.groupBy({
        by: ["category"],
        _count: { category: true },
      }),
    ]);

  const recentJobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      searchCode: true,
      role: true,
      companyName: true,
      postedDate: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button nativeButton={false} render={<Link href="/admin/jobs/new" />}>
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </div>

      <StatsCards
        stats={{
          totalJobs,
          featuredJobs,
          trendingJobs,
          totalCompanies,
          byCategory: categoryCounts.map((c) => ({
            category: c.category,
            count: c._count.category,
          })),
        }}
      />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Jobs</h2>
        <div className="rounded-lg border divide-y">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 text-sm"
            >
              <div>
                <span className="font-mono text-primary mr-2">{job.searchCode}</span>
                <span className="font-medium">{job.role}</span>
                <span className="text-muted-foreground ml-2">@ {job.companyName}</span>
              </div>
              <Link
                href={`/admin/jobs/${job.id}/edit`}
                className="text-primary hover:underline text-xs"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
