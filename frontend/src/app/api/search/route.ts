import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { JobCategory, JobType } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category") as JobCategory | null;
    const jobType = searchParams.get("jobType") as JobType | null;
    const location = searchParams.get("location")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "";

    if (!q && !location && !category && !jobType && !role) {
      return NextResponse.json({ jobs: [] });
    }

    const and: Prisma.JobWhereInput[] = [];

    if (category) and.push({ category });
    if (jobType) and.push({ jobType });
    if (location) {
      and.push({ location: { contains: location, mode: "insensitive" } });
    }
    if (role) {
      and.push({ role: { contains: role, mode: "insensitive" } });
    }

    if (q) {
      const textConditions: Prisma.JobWhereInput[] = [
        { searchCode: { equals: q.toUpperCase(), mode: "insensitive" } },
        { searchCode: { startsWith: q, mode: "insensitive" } },
        { companyName: { contains: q, mode: "insensitive" } },
        { role: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
      and.push({ OR: textConditions });
    }

    const where: Prisma.JobWhereInput =
      and.length === 1 ? and[0] : { AND: and };

    const jobs = await db.job.findMany({
      where,
      orderBy: [{ featured: "desc" }, { postedDate: "desc" }],
      take: 20,
    });

    if (q) {
      const exactMatch = jobs.find(
        (j) => j.searchCode.toUpperCase() === q.toUpperCase()
      );
      if (exactMatch) {
        const rest = jobs.filter((j) => j.id !== exactMatch.id);
        return NextResponse.json({ jobs: [exactMatch, ...rest] });
      }
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ jobs: [], error: "Search failed" }, { status: 500 });
  }
}
