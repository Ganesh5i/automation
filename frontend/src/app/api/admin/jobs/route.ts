import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobSchema } from "@/lib/validations/job";
import { generateSearchCode } from "@/lib/search-code";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const searchCode = (
      data.searchCode?.trim() || (await generateSearchCode())
    ).toUpperCase();

    const existing = await db.job.findUnique({ where: { searchCode } });
    if (existing) {
      return NextResponse.json(
        { error: `Search code "${searchCode}" is already in use` },
        { status: 400 }
      );
    }

    const company = await db.company.findFirst({
      where: { name: { equals: data.companyName, mode: "insensitive" } },
    });

    const job = await db.job.create({
      data: {
        searchCode,
        companyName: data.companyName,
        companyLogo: data.companyLogo || null,
        companyId: company?.id || data.companyId || null,
        role: data.role,
        category: data.category,
        jobType: data.jobType,
        location: data.location,
        experience: data.experience,
        qualification: data.qualification || null,
        salary: data.salary || null,
        description: data.description,
        responsibilities: data.responsibilities,
        skills: data.skills,
        applyLink: data.applyLink,
        featured: data.featured,
        trending: data.trending,
        ...(data.postedDate && { postedDate: new Date(data.postedDate) }),
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
