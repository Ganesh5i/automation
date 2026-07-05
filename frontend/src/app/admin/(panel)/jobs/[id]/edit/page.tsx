import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JobForm } from "@/components/admin/job-form";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await db.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit Job — {job.searchCode}</h1>
      <JobForm job={job} />
    </div>
  );
}
