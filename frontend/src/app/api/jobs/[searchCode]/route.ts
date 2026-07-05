import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ searchCode: string }> }
) {
  try {
    const { searchCode } = await params;
    const job = await db.job.findUnique({
      where: { searchCode: searchCode.toUpperCase() },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Job fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}
