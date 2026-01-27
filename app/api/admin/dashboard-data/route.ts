import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const include = searchParams
      .get("include")
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await convex.query(api.dashboard.getData, {
      include: include && include.length > 0 ? include : undefined,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
