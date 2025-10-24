import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import {
  consultationSubmissions,
  quoteSubmissions,
  contactSubmissions,
  adminUsers,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// Helper function to check if user is admin
async function checkAdminRole(userId: string) {
  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.supabaseUserId, userId),
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  return admin;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User ID:", user.id);
    const admin = await checkAdminRole(user.id);
    if (!admin) {
      console.error("User is not an admin:", user.id);
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "consultations") {
      const submissions = await db.query.consultationSubmissions.findMany({
        orderBy: [desc(consultationSubmissions.createdAt)],
      });
      return NextResponse.json({ submissions });
    } else if (type === "quotes") {
      const submissions = await db.query.quoteSubmissions.findMany({
        orderBy: [desc(quoteSubmissions.createdAt)],
      });
      return NextResponse.json({ submissions });
    } else if (type === "contacts") {
      const submissions = await db.query.contactSubmissions.findMany({
        orderBy: [desc(contactSubmissions.createdAt)],
      });
      return NextResponse.json({ submissions });
    } else {
      // Return all types
      const consultations = await db.query.consultationSubmissions.findMany({
        orderBy: [desc(consultationSubmissions.createdAt)],
        limit: 10,
      });
      const quotes = await db.query.quoteSubmissions.findMany({
        orderBy: [desc(quoteSubmissions.createdAt)],
        limit: 10,
      });
      const contacts = await db.query.contactSubmissions.findMany({
        orderBy: [desc(contactSubmissions.createdAt)],
        limit: 10,
      });
      return NextResponse.json({ consultations, quotes, contacts });
    }
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await checkAdminRole(user.id);
    if (!admin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Viewers cannot modify
    if (admin.role === "viewer") {
      return NextResponse.json(
        { error: "Forbidden - Modification not allowed" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, type, status } = body;

    if (!id || !type) {
      return NextResponse.json(
        { error: "Missing id or type" },
        { status: 400 }
      );
    }

    // Prepare updates object
    const updates: any = {};
    if (status) {
      updates.status = status;
    }
    updates.updatedAt = new Date();

    if (type === "consultation" || type === "consultations") {
      const [updated] = await db
        .update(consultationSubmissions)
        .set(updates)
        .where(eq(consultationSubmissions.id, id))
        .returning();
      return NextResponse.json({ success: true, submission: updated });
    } else if (type === "quote" || type === "quotes") {
      const [updated] = await db
        .update(quoteSubmissions)
        .set(updates)
        .where(eq(quoteSubmissions.id, id))
        .returning();
      return NextResponse.json({ success: true, submission: updated });
    } else if (type === "contact" || type === "contacts") {
      const [updated] = await db
        .update(contactSubmissions)
        .set(updates)
        .where(eq(contactSubmissions.id, id))
        .returning();
      return NextResponse.json({ success: true, submission: updated });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await checkAdminRole(user.id);
    if (!admin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Only super_admin can delete
    if (admin.role !== "super_admin") {
      return NextResponse.json(
        { error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, type } = body;

    if (!id || !type) {
      return NextResponse.json(
        { error: "Missing id or type" },
        { status: 400 }
      );
    }

    if (type === "consultation" || type === "consultations") {
      await db
        .delete(consultationSubmissions)
        .where(eq(consultationSubmissions.id, id));
    } else if (type === "quote" || type === "quotes") {
      await db.delete(quoteSubmissions).where(eq(quoteSubmissions.id, id));
    } else if (type === "contact" || type === "contacts") {
      await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
