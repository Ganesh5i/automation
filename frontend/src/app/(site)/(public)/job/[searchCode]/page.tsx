import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { JobDetailHeader } from "@/components/jobs/job-detail-header";
import { ShareButtons } from "@/components/jobs/share-buttons";
import { BookmarkButton } from "@/components/jobs/bookmark-button";
import { RelatedJobs } from "@/components/jobs/related-jobs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createMetadata, jobPostingJsonLd } from "@/lib/seo";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface JobPageProps {
  params: Promise<{ searchCode: string }>;
}

export async function generateMetadata({ params }: JobPageProps) {
  const { searchCode } = await params;
  const job = await db.job.findUnique({
    where: { searchCode: searchCode.toUpperCase() },
  });

  if (!job) return { title: "Job Not Found" };

  return createMetadata({
    title: `${job.role} at ${job.companyName}`,
    description: job.description.slice(0, 160),
    path: `/job/${job.searchCode}`,
  });
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { searchCode } = await params;
  const job = await db.job.findUnique({
    where: { searchCode: searchCode.toUpperCase() },
  });

  if (!job) notFound();

  const jsonLd = jobPostingJsonLd(job);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <JobDetailHeader job={job} />

        <div className="flex flex-wrap gap-3 mt-6">
          <Button size="lg" nativeButton={false} render={<a href={job.applyLink} target="_blank" rel="noopener noreferrer" />}>
            <ExternalLink className="h-4 w-4" />
            Apply Now
          </Button>
          <BookmarkButton searchCode={job.searchCode} />
        </div>

        <div className="mt-4">
          <ShareButtons title={`${job.role} at ${job.companyName}`} searchCode={job.searchCode} />
        </div>

        <article className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </section>

          {job.responsibilities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {job.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {job.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </article>

        <RelatedJobs job={job} />

        <div className="mt-8 text-center">
          <Link href="/jobs" className="text-sm text-primary hover:underline">
            ← Browse more jobs
          </Link>
        </div>
      </div>
    </>
  );
}
