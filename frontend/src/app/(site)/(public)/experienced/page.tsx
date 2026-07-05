import { JobListingPage } from "@/components/jobs/job-listing-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Experienced Jobs",
  description: "Job opportunities for experienced professionals.",
  path: "/experienced",
});

export const dynamic = "force-dynamic";

export default function ExperiencedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; location?: string; role?: string; experience?: string; jobType?: string }>;
}) {
  return (
    <JobListingPage
      title="Experienced Jobs"
      description="Roles for professionals with relevant industry experience."
      category="EXPERIENCED"
      searchParams={searchParams}
    />
  );
}
