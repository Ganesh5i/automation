import { JobListingPage } from "@/components/jobs/job-listing-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Fresher Jobs",
  description: "Latest fresher job opportunities and entry-level positions.",
  path: "/jobs",
});

export const dynamic = "force-dynamic";

export default function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; location?: string; role?: string; experience?: string; jobType?: string }>;
}) {
  return (
    <JobListingPage
      title="Fresher Jobs"
      description="Entry-level opportunities for fresh graduates and early-career professionals."
      category="FRESHER"
      searchParams={searchParams}
    />
  );
}
