import { JobListingPage } from "@/components/jobs/job-listing-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Work From Home Jobs",
  description: "Flexible work from home job opportunities.",
  path: "/work-from-home",
});

export const dynamic = "force-dynamic";

export default function WorkFromHomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; location?: string; role?: string; experience?: string; jobType?: string }>;
}) {
  return (
    <JobListingPage
      title="Work From Home"
      description="Flexible WFH opportunities across industries."
      category="WORK_FROM_HOME"
      searchParams={searchParams}
    />
  );
}
