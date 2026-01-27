import { NextRequest, NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json({ error: "Type parameter is required" }, { status: 400 });
    }

    const options = await convex.query(api.dropdownOptions.list, {
      type: type as any,
      activeOnly: true,
    });

    return NextResponse.json({ options });
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
    return NextResponse.json({ error: "Failed to fetch dropdown options" }, { status: 500 });
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

    const id = await convex.mutation(api.dropdownOptions.create, {
      type: type as any,
      label,
      value,
      order: "0",
    });

    const option = await convex.query(api.dropdownOptions.get, { id: id as any });

    return NextResponse.json({ option }, { status: 201 });
  } catch (error) {
    console.error("Error creating dropdown option:", error);
    return NextResponse.json({ error: "Failed to create dropdown option" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, label, value, isActive, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await convex.mutation(api.dropdownOptions.update, {
      id: id as any,
      label,
      value,
      isActive,
      order,
    });

    const updated = await convex.query(api.dropdownOptions.get, { id: id as any });

    if (!updated) {
      return NextResponse.json({ error: "Dropdown option not found" }, { status: 404 });
    }

    return NextResponse.json({ option: updated });
  } catch (error) {
    console.error("Error updating dropdown option:", error);
    return NextResponse.json({ error: "Failed to update dropdown option" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    await convex.mutation(api.dropdownOptions.remove, { id: id as any });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dropdown option:", error);
    return NextResponse.json({ error: "Failed to delete dropdown option" }, { status: 500 });
  }
}
