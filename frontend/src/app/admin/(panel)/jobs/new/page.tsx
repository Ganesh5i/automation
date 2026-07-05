import { generateSearchCode } from "@/lib/search-code";
import { JobForm } from "@/components/admin/job-form";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  const nextSearchCode = await generateSearchCode();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Add New Job</h1>
      <JobForm nextSearchCode={nextSearchCode} />
    </div>
  );
}
