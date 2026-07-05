import { db } from "@/lib/db";

export async function generateSearchCode(): Promise<string> {
  const lastJob = await db.job.findFirst({
    orderBy: { searchCode: "desc" },
    select: { searchCode: true },
  });

  if (!lastJob?.searchCode) {
    return "CS001";
  }

  const match = lastJob.searchCode.match(/^CS(\d+)$/i);
  if (!match) {
    const count = await db.job.count();
    return `CS${String(count + 1).padStart(3, "0")}`;
  }

  const next = parseInt(match[1], 10) + 1;
  return `CS${String(next).padStart(3, "0")}`;
}
