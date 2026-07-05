import { db } from "@/lib/db";
import { CompanyCard } from "@/components/companies/company-card";
import { createMetadata } from "@/lib/seo";
import { EmptyState } from "@/components/search/empty-state";

export const metadata = createMetadata({
  title: "Companies",
  description: "Browse top hiring companies and their open positions.",
  path: "/companies",
});

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await db.company.findMany({
    include: { _count: { select: { jobs: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Companies</h1>
        <p className="text-muted-foreground mt-2">
          Explore companies hiring on Career_Snap
        </p>
      </div>

      {companies.length === 0 ? (
        <EmptyState title="No companies yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
