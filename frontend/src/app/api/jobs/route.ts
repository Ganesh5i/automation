import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { JOBS_PER_PAGE } from "@/lib/constants";
import type { JobCategory } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = Math.min(
      100,
      parseInt(searchParams.get("perPage") || String(JOBS_PER_PAGE), 10)
    );
    const category = searchParams.get("category") as JobCategory | null;
    const location = searchParams.get("location")?.trim();
    const role = searchParams.get("role")?.trim();
    const experience = searchParams.get("experience")?.trim();
    const jobType = searchParams.get("jobType")?.trim();

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (role) where.role = { contains: role, mode: "insensitive" };
    if (experience) where.experience = { contains: experience, mode: "insensitive" };
    if (jobType) where.jobType = jobType;

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        orderBy: { postedDate: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        total,
        totalPages: Math.ceil(total / perPage),
        perPage,
      },
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
