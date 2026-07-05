import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateSearchCode } from "@/lib/search-code";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchCode = await generateSearchCode();
  return NextResponse.json({ searchCode });
}
