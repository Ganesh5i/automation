import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobSchema } from "@/lib/validations/job";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.searchCode) {
      const searchCode = data.searchCode.toUpperCase();
      const existing = await db.job.findFirst({
        where: { searchCode, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Search code "${searchCode}" is already in use` },
          { status: 400 }
        );
      }
    }

    const company = await db.company.findFirst({
      where: { name: { equals: data.companyName, mode: "insensitive" } },
    });

    const job = await db.job.update({
      where: { id },
      data: {
        ...(data.searchCode && { searchCode: data.searchCode.toUpperCase() }),
        companyName: data.companyName,
        companyLogo: data.companyLogo || null,
        companyId: company?.id || null,
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

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
