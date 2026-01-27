import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// Enable ISR with 5 minute revalidation for GET requests
export const revalidate = 300;

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return session;
}

export async function GET(_request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partners = await convex.query(api.partners.list, { activeOnly: true });

    return NextResponse.json(
      { partners },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "CDN-Cache-Control": "public, s-maxage=3600",
          Vary: "Accept-Encoding",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, icon, image } = body;

    if (!name || (!icon && !image)) {
      return NextResponse.json(
        { error: "Name and either icon or image are required" },
        { status: 400 }
      );
    }

    const existing = await convex.query(api.partners.list, { activeOnly: false });
    const maxOrder = existing.reduce((acc: number, p: any) => {
      const v = parseInt(p.order || "0", 10);
      return Number.isFinite(v) ? Math.max(acc, v) : acc;
    }, 0);

    const id = await convex.mutation(api.partners.create, {
      name,
      icon: icon || undefined,
      image: image || undefined,
      order: String(maxOrder + 1),
    });

    const partner = await convex.query(api.partners.get, { id: id as any });

    return NextResponse.json(
      { partner, message: "Partner created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, icon, image, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 });
    }

    await convex.mutation(api.partners.update, {
      id: id as any,
      name,
      icon,
      image,
      isActive,
    });

    const partner = await convex.query(api.partners.get, { id: id as any });
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({ partner, message: "Partner updated successfully" });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 });
    }

    const existing = await convex.query(api.partners.get, { id: id as any });
    if (!existing) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    await convex.mutation(api.partners.remove, { id: id as any });

    return NextResponse.json({ message: "Partner deleted successfully" });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
  }
}
