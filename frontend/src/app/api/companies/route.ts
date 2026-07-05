import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const companies = await db.company.findMany({
      include: {
        _count: { select: { jobs: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Companies API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
