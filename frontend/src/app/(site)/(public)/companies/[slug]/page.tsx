import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { JobGrid } from "@/components/jobs/job-grid";
import { createMetadata } from "@/lib/seo";
import { Building2, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await db.company.findUnique({ where: { slug } });
  if (!company) return { title: "Company Not Found" };

  return createMetadata({
    title: `${company.name} Jobs`,
    description: company.description || `Open positions at ${company.name}`,
    path: `/companies/${slug}`,
  });
}

export default async function CompanyDetailPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await db.company.findUnique({
    where: { slug },
    include: {
      jobs: { orderBy: { postedDate: "desc" } },
      _count: { select: { jobs: true } },
    },
  });

  if (!company) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="h-20 w-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={80}
                height={80}
                className="object-contain p-2"
              />
            ) : (
              <Building2 className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-primary font-medium mt-1">
              {company._count.jobs} open{" "}
              {company._count.jobs === 1 ? "position" : "positions"}
            </p>
            {company.description && (
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {company.description}
              </p>
            )}
            {company.website && (
              <Button
                variant="outline"
                className="mt-4 gap-2"
                nativeButton={false}
                render={
                  <a href={company.website} target="_blank" rel="noopener noreferrer" />
                }
              >
                <Globe className="h-4 w-4" />
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
      {company.jobs.length === 0 ? (
        <p className="text-muted-foreground">No open positions at the moment.</p>
      ) : (
        <JobGrid jobs={company.jobs} />
      )}

      <div className="mt-8">
        <Link href="/companies" className="text-sm text-primary hover:underline">
          ← All companies
        </Link>
      </div>
    </div>
  );
}
