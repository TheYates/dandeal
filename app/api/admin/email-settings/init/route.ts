import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

/**
 * Initialize email notification settings for all form types
 *
 * Usage: POST /api/admin/email-settings/init
 * Body: { recipientEmail?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const recipientEmail = (body?.recipientEmail as string | undefined) || undefined;

    // Ensure base docs exist
    await convex.mutation(api.emailSettings.init, {});

    if (recipientEmail) {
      const formTypes = ["quote", "consultation", "contact"] as const;
      for (const formType of formTypes) {
        const current = await convex.query(api.emailSettings.getByFormType, { formType });
        const currentEmails: string[] = (() => {
          try {
            return JSON.parse(current?.recipientEmails || "[]");
          } catch {
            return [];
          }
        })();

        if (!currentEmails.includes(recipientEmail)) currentEmails.push(recipientEmail);

        await convex.mutation(api.emailSettings.upsert, {
          formType,
          recipientEmails: JSON.stringify(currentEmails),
          enabled: true,
        });
      }
    }

    const settings = await convex.query(api.emailSettings.list, {});

    return NextResponse.json({
      success: true,
      message: "Email notification settings initialized",
      results: settings,
    });
  } catch (error) {
    console.error("Error initializing email settings:", error);
    return NextResponse.json(
      { error: "Failed to initialize email settings" },
      { status: 500 }
    );
  }
}
