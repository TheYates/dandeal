import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// GET all email notification settings
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await convex.query(api.emailSettings.list, {});

    // Parse recipient emails from JSON strings to arrays (admin UI expects arrays)
    const parsed = settings.map((setting: any) => ({
      ...setting,
      recipientEmails: (() => {
        try {
          return JSON.parse(setting.recipientEmails || "[]");
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching email settings:", error);
    return NextResponse.json({ error: "Failed to fetch email settings" }, { status: 500 });
  }
}

// PATCH update email notification settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { formType, recipientEmails, enabled, subjectTemplate, includeFormData } = body;

    if (!formType) {
      return NextResponse.json({ error: "formType is required" }, { status: 400 });
    }

    await convex.mutation(api.emailSettings.upsert, {
      formType,
      recipientEmails: JSON.stringify(recipientEmails || []),
      enabled: enabled !== undefined ? Boolean(enabled) : undefined,
      subjectTemplate: subjectTemplate ?? undefined,
      includeFormData: includeFormData !== undefined ? Boolean(includeFormData) : undefined,
    });

    const updated = await convex.query(api.emailSettings.getByFormType, { formType });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating email settings:", error);
    return NextResponse.json({ error: "Failed to update email settings" }, { status: 500 });
  }
}
