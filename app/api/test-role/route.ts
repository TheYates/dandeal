import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const admin = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.supabaseUserId, user.id),
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      admin: admin ? {
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      } : null,
    });
  } catch (error) {
    console.error("Error checking role:", error);
    return NextResponse.json(
      { error: "Failed to check role" },
      { status: 500 }
    );
  }
}
