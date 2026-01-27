import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// GET - Fetch all testimonials (admin)
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allTestimonials = await convex.query(api.testimonials.list, { activeOnly: false });
    // Keep old order: desc by `order`
    allTestimonials.sort((a: any, b: any) => {
      const orderA = parseInt(a.order || "0", 10);
      const orderB = parseInt(b.order || "0", 10);
      return orderB - orderA;
    });

    return NextResponse.json({ testimonials: allTestimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

// POST - Create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientName, clientTitle, clientCompany, content, rating, image } = body;

    if (!clientName || !content) {
      return NextResponse.json(
        { error: "Client name and content are required" },
        { status: 400 }
      );
    }

    const existing = await convex.query(api.testimonials.list, { activeOnly: false });
    const maxOrder = existing.reduce((acc: number, t: any) => {
      const v = parseInt(t.order || "0", 10);
      return Number.isFinite(v) ? Math.max(acc, v) : acc;
    }, 0);

    const id = await convex.mutation(api.testimonials.create, {
      clientName,
      clientTitle: clientTitle || undefined,
      clientCompany: clientCompany || undefined,
      content,
      rating: rating ? String(rating) : undefined,
      image: image || undefined,
      order: String(maxOrder + 1),
    });

    const testimonial = await convex.query(api.testimonials.get, { id: id as any });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

// PATCH - Update a testimonial
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: "ID and updates are required" }, { status: 400 });
    }

    await convex.mutation(api.testimonials.update, { id: id as any, ...(updates as any) });

    const testimonial = await convex.query(api.testimonials.get, { id: id as any });
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

// DELETE - Delete a testimonial
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 });
    }

    await convex.mutation(api.testimonials.remove, { id: id as any });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
