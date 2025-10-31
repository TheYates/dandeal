import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailNotificationSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all email notification settings
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

    const settings = await db.query.emailNotificationSettings.findMany();

    // Parse recipient emails from JSON strings
    const parsedSettings = settings.map((setting) => ({
      ...setting,
      recipientEmails: JSON.parse(setting.recipientEmails || "[]"),
    }));

    return NextResponse.json(parsedSettings);
  } catch (error) {
    console.error("Error fetching email settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch email settings" },
      { status: 500 }
    );
  }
}

// PATCH update email notification settings
export async function PATCH(request: NextRequest) {
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
    const { formType, recipientEmails, enabled, subjectTemplate, includeFormData } = body;

    if (!formType) {
      return NextResponse.json(
        { error: "formType is required" },
        { status: 400 }
      );
    }

    // Update or insert settings
    const result = await db
      .update(emailNotificationSettings)
      .set({
        recipientEmails: JSON.stringify(recipientEmails || []),
        enabled: enabled !== undefined ? enabled : true,
        subjectTemplate: subjectTemplate || null,
        includeFormData: includeFormData !== undefined ? includeFormData : true,
        updatedAt: new Date(),
      })
      .where(eq(emailNotificationSettings.formType, formType))
      .returning();

    if (result.length === 0) {
      // Insert if not found
      const inserted = await db
        .insert(emailNotificationSettings)
        .values({
          formType,
          recipientEmails: JSON.stringify(recipientEmails || []),
          enabled: enabled !== undefined ? enabled : true,
          subjectTemplate: subjectTemplate || null,
          includeFormData: includeFormData !== undefined ? includeFormData : true,
        })
        .returning();

      return NextResponse.json(inserted[0]);
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating email settings:", error);
    return NextResponse.json(
      { error: "Failed to update email settings" },
      { status: 500 }
    );
  }
}

