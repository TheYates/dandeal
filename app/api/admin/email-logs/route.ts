import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// GET email logs with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const formType = searchParams.get("formType") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const logs = await convex.query(api.emailLogs.list, {
      formType,
      status,
      limit,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json({ error: "Failed to fetch email logs" }, { status: 500 });
  }
}

// POST create email log entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { formType, submissionId, recipientEmail, subject, status, errorMessage, sentAt } = body;

    if (!formType || !recipientEmail || !subject || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = await convex.mutation(api.emailLogs.create, {
      formType,
      submissionId: submissionId ? String(submissionId) : undefined,
      recipientEmail,
      subject,
      status,
      errorMessage: errorMessage || undefined,
      sentAt: sentAt ? Number(sentAt) : undefined,
    });

    const created = await convex.query(api.emailLogs.get, { id: id as any });
    return NextResponse.json(created);
  } catch (error) {
    console.error("Error creating email log:", error);
    return NextResponse.json({ error: "Failed to create email log" }, { status: 500 });
  }
}
