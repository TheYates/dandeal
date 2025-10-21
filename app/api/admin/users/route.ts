import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Helper function to check if user is super admin
async function checkSuperAdminRole(userId: string) {
  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.clerkUserId, userId),
  });

  if (!admin || !admin.isActive || admin.role !== "super_admin") {
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(userId);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const users = await db.query.adminUsers.findMany({
      orderBy: (adminUsers, { desc }) => [desc(adminUsers.createdAt)],
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdmin = await checkSuperAdminRole(userId);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    // Add updated timestamp
    updates.updatedAt = new Date();

    const [updated] = await db
      .update(adminUsers)
      .set(updates)
      .where(eq(adminUsers.id, id))
      .returning();

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Error updating admin user:", error);
    return NextResponse.json(
      { error: "Failed to update admin user" },
      { status: 500 }
    );
  }
}
