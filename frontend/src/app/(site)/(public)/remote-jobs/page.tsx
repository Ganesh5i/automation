import { JobListingPage } from "@/components/jobs/job-listing-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Remote Jobs",
  description: "Work from anywhere with remote job opportunities.",
  path: "/remote-jobs",
});

export const dynamic = "force-dynamic";

export default function RemoteJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; location?: string; role?: string; experience?: string; jobType?: string }>;
}) {
  return (
    <JobListingPage
      title="Remote Jobs"
      description="Fully remote positions you can do from anywhere."
      category="REMOTE"
      searchParams={searchParams}
    />
  );
}
