import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

async function getAdminByEmail(email: string) {
  return await convex.query(api.adminUsers.getByEmail, { email });
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await getAdminByEmail(session.user.email);
    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (type === "consultations") {
      const submissions = await convex.query(api.consultations.list, { limit });
      return NextResponse.json({ submissions, total: submissions.length, limit });
    }

    if (type === "quotes") {
      const submissions = await convex.query(api.quotes.list, { limit });
      return NextResponse.json({ submissions, total: submissions.length, limit });
    }

    if (type === "contacts") {
      const submissions = await convex.query(api.contacts.list, { limit });
      return NextResponse.json({ submissions, total: submissions.length, limit });
    }

    const [consultations, quotes, contacts] = await Promise.all([
      convex.query(api.consultations.list, { limit: 10 }),
      convex.query(api.quotes.list, { limit: 10 }),
      convex.query(api.contacts.list, { limit: 10 }),
    ]);

    return NextResponse.json({ consultations, quotes, contacts });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await getAdminByEmail(session.user.email);
    if (!admin || !admin.isActive || admin.role === "viewer") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { id, type, status } = body;

    if (!id || !type) {
      return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
    }

    if (type === "consultation" || type === "consultations") {
      await convex.mutation(api.consultations.updateStatus, { id: id as any, status });
      const updated = await convex.query(api.consultations.get, { id: id as any });
      return NextResponse.json({ success: true, submission: updated });
    }

    if (type === "quote" || type === "quotes") {
      await convex.mutation(api.quotes.updateStatus, { id: id as any, status });
      const updated = await convex.query(api.quotes.get, { id: id as any });
      return NextResponse.json({ success: true, submission: updated });
    }

    if (type === "contact" || type === "contacts") {
      await convex.mutation(api.contacts.updateStatus, { id: id as any, status });
      const updated = await convex.query(api.contacts.get, { id: id as any });
      return NextResponse.json({ success: true, submission: updated });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await getAdminByEmail(session.user.email);
    if (!admin || !admin.isActive || admin.role !== "super_admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { id, type } = body;

    if (!id || !type) {
      return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
    }

    if (type === "consultation" || type === "consultations") {
      await convex.mutation(api.consultations.remove, { id: id as any });
      return NextResponse.json({ success: true, message: "Submission deleted" });
    }

    if (type === "quote" || type === "quotes") {
      await convex.mutation(api.quotes.remove, { id: id as any });
      return NextResponse.json({ success: true, message: "Submission deleted" });
    }

    if (type === "contact" || type === "contacts") {
      await convex.mutation(api.contacts.remove, { id: id as any });
      return NextResponse.json({ success: true, message: "Submission deleted" });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
