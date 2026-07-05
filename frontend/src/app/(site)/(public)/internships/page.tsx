import { JobListingPage } from "@/components/jobs/job-listing-page";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Internships",
  description: "Latest internship opportunities across top companies.",
  path: "/internships",
});

export const dynamic = "force-dynamic";

export default function InternshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; location?: string; role?: string; experience?: string; jobType?: string }>;
}) {
  return (
    <JobListingPage
      title="Internships"
      description="Internship programs for students and fresh graduates."
      category="INTERNSHIP"
      searchParams={searchParams}
    />
  );
}
