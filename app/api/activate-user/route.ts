import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("Activating user:", email);

    // Update the user's isActive status to true
    const result = await db
      .update(adminUsers)
      .set({ isActive: true })
      .where(eq(adminUsers.email, email))
      .returning();

    console.log("User activation result:", result);

    if (result.length === 0) {
      console.error("User not found:", email);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("User activated successfully:", email);

    return NextResponse.json(
      { message: "User activated successfully", user: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error activating user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

