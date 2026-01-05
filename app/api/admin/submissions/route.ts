import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  consultationSubmissions,
  quoteSubmissions,
  contactSubmissions,
  adminUsers,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// Helper function to check if user is admin
async function checkAdminRole(email: string) {
  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  return admin;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      console.error("No user found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User email:", session.user.email);
    const admin = await checkAdminRole(session.user.email);
    if (!admin) {
      console.error("User is not an admin:", session.user.email);
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50; // Default 50 items

    if (type === "consultations") {
      const submissions = await db.query.consultationSubmissions.findMany({
        orderBy: [desc(consultationSubmissions.createdAt)],
        limit,
      });
      return NextResponse.json({ 
        submissions,
        total: submissions.length,
        limit,
      });
    } else if (type === "quotes") {
      const submissions = await db.query.quoteSubmissions.findMany({
        orderBy: [desc(quoteSubmissions.createdAt)],
        limit,
      });
      return NextResponse.json({ 
        submissions,
        total: submissions.length,
        limit,
      });
    } else if (type === "contacts") {
      const submissions = await db.query.contactSubmissions.findMany({
        orderBy: [desc(contactSubmissions.createdAt)],
        limit,
      });
      return NextResponse.json({ 
        submissions,
        total: submissions.length,
        limit,
      });
    } else {
      // Return all types with pagination
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
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await checkAdminRole(session.user.email);
    if (!admin) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Viewers cannot modify
    if (admin.role === "viewer") {
      return NextResponse.json(
        { error: "Access denied" },
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
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await checkAdminRole(session.user.email);
    if (!admin) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Only super_admin can delete
    if (admin.role !== "super_admin") {
      return NextResponse.json(
        { error: "Access denied" },
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

    console.log(`[DELETE] Attempting to delete ${type} with id:`, id);

    let deletedCount = 0;
    if (type === "consultation" || type === "consultations") {
      const result = await db
        .delete(consultationSubmissions)
        .where(eq(consultationSubmissions.id, id))
        .returning();
      deletedCount = result.length;
    } else if (type === "quote" || type === "quotes") {
      const result = await db
        .delete(quoteSubmissions)
        .where(eq(quoteSubmissions.id, id))
        .returning();
      deletedCount = result.length;
    } else if (type === "contact" || type === "contacts") {
      const result = await db
        .delete(contactSubmissions)
        .where(eq(contactSubmissions.id, id))
        .returning();
      deletedCount = result.length;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    console.log(`[DELETE] Successfully deleted ${deletedCount} ${type} record(s)`);

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
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
