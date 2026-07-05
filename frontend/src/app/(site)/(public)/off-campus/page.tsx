import { JobListingPage } from "@/components/jobs/job-listing-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Off Campus Drives",
  description: "Off-campus hiring drives and walk-in opportunities.",
  path: "/off-campus",
});

export const dynamic = "force-dynamic";

export default function OffCampusPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; location?: string; role?: string; experience?: string; jobType?: string }>;
}) {
  return (
    <JobListingPage
      title="Off Campus Drives"
      description="Off-campus hiring drives for graduates outside campus placements."
      category="OFF_CAMPUS"
      searchParams={searchParams}
    />
  );
}
