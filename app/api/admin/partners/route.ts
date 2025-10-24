import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const allPartners = await db
      .select()
      .from(partners)
      .where(eq(partners.isActive, true))
      .orderBy(asc(partners.order));

    return NextResponse.json({ partners: allPartners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    if (!name || !icon) {
      return NextResponse.json(
        { error: "Name and icon are required" },
        { status: 400 }
      );
    }

    // Get the highest order value
    const lastPartner = await db
      .select()
      .from(partners)
      .orderBy(asc(partners.order))
      .limit(1);

    const nextOrder = lastPartner.length > 0 
      ? (parseInt(lastPartner[0].order || "0") + 1).toString()
      : "0";

    const newPartner = await db
      .insert(partners)
      .values({
        name,
        icon,
        order: nextOrder,
        isActive: true,
      })
      .returning();

    return NextResponse.json(
      { partner: newPartner[0], message: "Partner created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, icon, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    const updatedPartner = await db
      .update(partners)
      .set(updateData)
      .where(eq(partners.id, id))
      .returning();

    if (updatedPartner.length === 0) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      partner: updatedPartner[0],
      message: "Partner updated successfully",
    });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const deletedPartner = await db
      .delete(partners)
      .where(eq(partners.id, id))
      .returning();

    if (deletedPartner.length === 0) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Partner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 }
    );
  }
}

