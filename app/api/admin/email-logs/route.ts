import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { emailLogs } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";

// GET email logs with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Check authentication with NextAuth
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const formType = searchParams.get("formType");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const query = db.select().from(emailLogs).$dynamic();
    
    const conditions = [];
    if (formType) conditions.push(eq(emailLogs.formType, formType));
    if (status) conditions.push(eq(emailLogs.status, status));

    const logs = await query
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(emailLogs.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch email logs" },
      { status: 500 }
    );
  }
}

// POST create email log entry
export async function POST(request: NextRequest) {
  try {
    // Check authentication with NextAuth
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      formType,
      submissionId,
      recipientEmail,
      subject,
      status,
      errorMessage,
      sentAt,
    } = body;

    if (!formType || !recipientEmail || !subject || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(emailLogs)
      .values({
        formType,
        submissionId: submissionId || null,
        recipientEmail,
        subject,
        status,
        errorMessage: errorMessage || null,
        sentAt: sentAt ? new Date(sentAt) : null,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating email log:", error);
    return NextResponse.json(
      { error: "Failed to create email log" },
      { status: 500 }
    );
  }
}

