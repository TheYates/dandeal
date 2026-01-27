import { NextRequest, NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// GET - Fetch all active testimonials (public endpoint)
export async function GET(_request: NextRequest) {
  try {
    const allTestimonials = await convex.query(api.testimonials.list, {
      activeOnly: true,
    });

    // Keep ordering consistent with the old Postgres endpoint (desc by `order`).
    const sorted = [...allTestimonials].sort((a: any, b: any) => {
      const orderA = parseInt(a.order || "0", 10);
      const orderB = parseInt(b.order || "0", 10);
      return orderB - orderA;
    });

    return NextResponse.json(
      { testimonials: sorted },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "CDN-Cache-Control": "public, s-maxage=3600",
          Vary: "Accept-Encoding",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ testimonials: [] }, { status: 200 });
  }
}
