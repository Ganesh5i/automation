import { db } from "@/lib/db";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobCategory } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const counts = await db.job.groupBy({
    by: ["category"],
    _count: { category: true },
  });

  const countMap = Object.fromEntries(
    counts.map((c) => [c.category, c._count.category])
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Job Categories</h1>
      <p className="text-muted-foreground mb-6">
        Category distribution across all job listings (read-only).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(CATEGORY_CONFIG) as JobCategory[]).map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-base">
                {CATEGORY_CONFIG[category].label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{countMap[category] || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">jobs</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
