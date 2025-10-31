import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailLogs } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET email logs with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
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

    let query = db.select().from(emailLogs);

    if (formType) {
      query = query.where(eq(emailLogs.formType, formType));
    }

    if (status) {
      query = query.where(eq(emailLogs.status, status));
    }

    const logs = await query
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
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
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

