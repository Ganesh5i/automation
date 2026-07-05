import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { companySchema } from "@/lib/validations/company";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = companySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const company = await db.company.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        logo: parsed.data.logo || null,
        description: parsed.data.description || null,
        website: parsed.data.website || null,
      },
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error("Create company error:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
