import { db } from "@/lib/db";
import { dropdownOptions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Type parameter is required" },
        { status: 400 }
      );
    }

    const options = await db
      .select()
      .from(dropdownOptions)
      .where(
        and(
          eq(dropdownOptions.type, type as any),
          eq(dropdownOptions.isActive, true)
        )
      )
      .orderBy(dropdownOptions.order);

    return NextResponse.json({ options });
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
    return NextResponse.json(
      { error: "Failed to fetch dropdown options" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, label, value } = body;

    if (!type || !label || !value) {
      return NextResponse.json(
        { error: "Type, label, and value are required" },
        { status: 400 }
      );
    }

    const newOption = await db
      .insert(dropdownOptions)
      .values({
        type: type as any,
        label,
        value,
        order: "0",
        isActive: true,
      })
      .returning();

    return NextResponse.json({ option: newOption[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating dropdown option:", error);
    return NextResponse.json(
      { error: "Failed to create dropdown option" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, label, value, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(dropdownOptions)
      .set({
        ...(label && { label }),
        ...(value && { value }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(dropdownOptions.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Dropdown option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ option: updated[0] });
  } catch (error) {
    console.error("Error updating dropdown option:", error);
    return NextResponse.json(
      { error: "Failed to update dropdown option" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required" },
        { status: 400 }
      );
    }

    await db
      .delete(dropdownOptions)
      .where(eq(dropdownOptions.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dropdown option:", error);
    return NextResponse.json(
      { error: "Failed to delete dropdown option" },
      { status: 500 }
    );
  }
}

